-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'viewer');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_purchases table
CREATE TABLE public.admin_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create viewer_subscriptions table
CREATE TABLE public.viewer_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    currency TEXT DEFAULT 'INR',
    transaction_id TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue TEXT,
    overs_format INTEGER DEFAULT 20 CHECK (overs_format IN (20, 30, 50)),
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT,
    logo_url TEXT,
    captain TEXT,
    coach TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    jersey_number INTEGER,
    role TEXT CHECK (role IN ('batsman', 'bowler', 'all-rounder', 'wicket-keeper')),
    batting_style TEXT,
    bowling_style TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
    team_a_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    team_b_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    venue TEXT NOT NULL,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    overs INTEGER DEFAULT 20,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
    toss_winner_id UUID REFERENCES public.teams(id),
    toss_decision TEXT CHECK (toss_decision IN ('bat', 'bowl')),
    winner_id UUID REFERENCES public.teams(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match_scores table
CREATE TABLE public.match_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL UNIQUE,
    team_a_runs INTEGER DEFAULT 0,
    team_a_wickets INTEGER DEFAULT 0,
    team_a_overs DECIMAL(4,1) DEFAULT 0,
    team_b_runs INTEGER DEFAULT 0,
    team_b_wickets INTEGER DEFAULT 0,
    team_b_overs DECIMAL(4,1) DEFAULT 0,
    current_batting_team_id UUID REFERENCES public.teams(id),
    current_bowler TEXT,
    current_striker TEXT,
    current_non_striker TEXT,
    ball_by_ball JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_settings table for superadmin
CREATE TABLE public.payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_purchase_amount DECIMAL(10,2) DEFAULT 999.00,
    viewer_subscription_amount DECIMAL(10,2) DEFAULT 20.00,
    admin_validity_days INTEGER DEFAULT 365,
    viewer_validity_days INTEGER DEFAULT 30,
    razorpay_key_id TEXT,
    stripe_key TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for tournaments
CREATE POLICY "Anyone can view tournaments"
ON public.tournaments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can create tournaments"
ON public.tournaments FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can update their own tournaments"
ON public.tournaments FOR UPDATE
TO authenticated
USING (admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Admins can delete their own tournaments"
ON public.tournaments FOR DELETE
TO authenticated
USING (admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for teams
CREATE POLICY "Anyone can view teams"
ON public.teams FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Tournament admins can manage teams"
ON public.teams FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments t
    WHERE t.id = tournament_id
    AND (t.admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'))
  )
);

-- RLS Policies for players
CREATE POLICY "Anyone can view players"
ON public.players FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Team admins can manage players"
ON public.players FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.teams tm
    JOIN public.tournaments t ON t.id = tm.tournament_id
    WHERE tm.id = team_id
    AND (t.admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'))
  )
);

-- RLS Policies for matches
CREATE POLICY "Anyone can view completed matches"
ON public.matches FOR SELECT
TO authenticated
USING (status = 'completed');

CREATE POLICY "Subscribers can view live matches"
ON public.matches FOR SELECT
TO authenticated
USING (
  status = 'live' AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'superadmin') OR
    EXISTS (
      SELECT 1 FROM public.viewer_subscriptions vs
      WHERE vs.user_id = auth.uid()
      AND vs.is_active = true
      AND vs.expiry_date > now()
    )
  )
);

CREATE POLICY "Anyone can view upcoming matches"
ON public.matches FOR SELECT
TO authenticated
USING (status = 'upcoming');

CREATE POLICY "Tournament admins can manage matches"
ON public.matches FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tournaments t
    WHERE t.id = tournament_id
    AND (t.admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'))
  )
);

-- RLS Policies for match_scores
CREATE POLICY "Anyone can view completed match scores"
ON public.match_scores FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id AND m.status = 'completed'
  )
);

CREATE POLICY "Subscribers can view live match scores"
ON public.match_scores FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id AND m.status = 'live'
  ) AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'superadmin') OR
    EXISTS (
      SELECT 1 FROM public.viewer_subscriptions vs
      WHERE vs.user_id = auth.uid()
      AND vs.is_active = true
      AND vs.expiry_date > now()
    )
  )
);

CREATE POLICY "Match admins can update scores"
ON public.match_scores FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.tournaments t ON t.id = m.tournament_id
    WHERE m.id = match_id
    AND (t.admin_id = auth.uid() OR public.has_role(auth.uid(), 'superadmin'))
  )
);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.viewer_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON public.viewer_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superadmins can view all subscriptions"
ON public.viewer_subscriptions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for admin purchases
CREATE POLICY "Admins can view their own purchases"
ON public.admin_purchases FOR SELECT
TO authenticated
USING (auth.uid() = admin_id);

CREATE POLICY "Superadmins can manage all purchases"
ON public.admin_purchases FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS Policies for payment settings
CREATE POLICY "Superadmins can manage payment settings"
ON public.payment_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Anyone can view payment settings"
ON public.payment_settings FOR SELECT
TO authenticated
USING (true);

-- Enable realtime for match_scores
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;

-- Insert default payment settings
INSERT INTO public.payment_settings (admin_purchase_amount, viewer_subscription_amount, admin_validity_days, viewer_validity_days)
VALUES (999.00, 20.00, 365, 30);