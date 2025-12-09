import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Clock, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  overs_format: number | null;
}

interface Team {
  id: string;
  name: string;
  short_name: string | null;
  tournament_id: string;
}

const ScheduleMatch = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [match, setMatch] = useState({
    tournament_id: '',
    team_a_id: '',
    team_b_id: '',
    match_date: '',
    match_time: '',
    venue: '',
    overs: 20
  });

  useEffect(() => {
    if (user) {
      fetchTournaments();
    }
  }, [user]);

  useEffect(() => {
    if (match.tournament_id) {
      fetchTeams(match.tournament_id);
      const tournament = tournaments.find(t => t.id === match.tournament_id);
      if (tournament?.overs_format) {
        setMatch(prev => ({ ...prev, overs: tournament.overs_format || 20 }));
      }
    }
  }, [match.tournament_id, tournaments]);

  const fetchTournaments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tournaments')
      .select('id, name, overs_format')
      .eq('admin_id', user.id);

    if (!error && data) {
      setTournaments(data);
    }
  };

  const fetchTeams = async (tournamentId: string) => {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, short_name, tournament_id')
      .eq('tournament_id', tournamentId);

    if (!error && data) {
      setTeams(data);
    }
  };

  const handleScheduleMatch = async () => {
    if (!match.tournament_id || !match.team_a_id || !match.team_b_id || !match.match_date || !match.venue) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields'
      });
      return;
    }

    if (match.team_a_id === match.team_b_id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select different teams'
      });
      return;
    }

    setLoading(true);

    const matchDateTime = match.match_time 
      ? `${match.match_date}T${match.match_time}:00` 
      : `${match.match_date}T00:00:00`;

    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .insert({
        tournament_id: match.tournament_id,
        team_a_id: match.team_a_id,
        team_b_id: match.team_b_id,
        match_date: matchDateTime,
        venue: match.venue,
        overs: match.overs,
        status: 'upcoming'
      })
      .select()
      .single();

    if (matchError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to schedule match'
      });
      setLoading(false);
      return;
    }

    // Create match scores record
    await supabase.from('match_scores').insert({
      match_id: matchData.id
    });

    toast({
      title: 'Success',
      description: 'Match scheduled successfully'
    });

    navigate('/matches');
    setLoading(false);
  };

  const filteredTeamsA = teams;
  const filteredTeamsB = teams.filter(t => t.id !== match.team_a_id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="font-display text-4xl mb-2">SCHEDULE MATCH</h1>
            <p className="text-muted-foreground mb-8">
              Create a new match between two teams
            </p>

            <div className="space-y-6">
              {/* Tournament Selection */}
              <div className="space-y-2">
                <Label>Tournament *</Label>
                <Select
                  value={match.tournament_id}
                  onValueChange={(value) => setMatch({ ...match, tournament_id: value, team_a_id: '', team_b_id: '' })}
                >
                  <SelectTrigger className="bg-secondary h-12">
                    <SelectValue placeholder="Select tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Team A *</Label>
                  <Select
                    value={match.team_a_id}
                    onValueChange={(value) => setMatch({ ...match, team_a_id: value })}
                    disabled={!match.tournament_id}
                  >
                    <SelectTrigger className="bg-secondary h-12">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeamsA.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} {t.short_name && `(${t.short_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Team B *</Label>
                  <Select
                    value={match.team_b_id}
                    onValueChange={(value) => setMatch({ ...match, team_b_id: value })}
                    disabled={!match.team_a_id}
                  >
                    <SelectTrigger className="bg-secondary h-12">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeamsB.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name} {t.short_name && `(${t.short_name})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Match Date *
                  </Label>
                  <Input
                    type="date"
                    value={match.match_date}
                    onChange={(e) => setMatch({ ...match, match_date: e.target.value })}
                    className="bg-secondary h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Match Time
                  </Label>
                  <Input
                    type="time"
                    value={match.match_time}
                    onChange={(e) => setMatch({ ...match, match_time: e.target.value })}
                    className="bg-secondary h-12"
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Venue *
                </Label>
                <Input
                  value={match.venue}
                  onChange={(e) => setMatch({ ...match, venue: e.target.value })}
                  className="bg-secondary h-12"
                  placeholder="Wankhede Stadium, Mumbai"
                />
              </div>

              {/* Overs */}
              <div className="space-y-2">
                <Label>Overs per Innings</Label>
                <Select
                  value={match.overs.toString()}
                  onValueChange={(value) => setMatch({ ...match, overs: parseInt(value) })}
                >
                  <SelectTrigger className="bg-secondary h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Overs</SelectItem>
                    <SelectItem value="10">10 Overs</SelectItem>
                    <SelectItem value="15">15 Overs</SelectItem>
                    <SelectItem value="20">20 Overs (T20)</SelectItem>
                    <SelectItem value="50">50 Overs (ODI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full" 
                onClick={handleScheduleMatch}
                disabled={loading}
              >
                {loading ? 'Scheduling...' : 'Schedule Match'}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleMatch;
