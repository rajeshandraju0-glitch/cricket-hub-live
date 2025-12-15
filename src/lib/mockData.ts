// Mock data for demonstration purposes

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: 'superadmin' | 'admin' | 'viewer';
  hasActiveSubscription: boolean;
}

export interface MockTournament {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  start_date: string;
  end_date: string;
  venue: string | null;
  overs_format: number | null;
  status: string | null;
  admin_id: string;
  created_at: string;
}

export interface MockTeam {
  id: string;
  name: string;
  short_name: string | null;
  logo_url: string | null;
  captain: string | null;
  coach: string | null;
  tournament_id: string;
  created_at: string;
}

export interface MockPlayer {
  id: string;
  name: string;
  role: string | null;
  batting_style: string | null;
  bowling_style: string | null;
  jersey_number: number | null;
  team_id: string;
  created_at: string;
}

export interface MockMatch {
  id: string;
  tournament_id: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  venue: string;
  overs: number | null;
  status: string | null;
  created_at: string;
}

export interface MockMatchScore {
  id: string;
  match_id: string;
  team_a_runs: number;
  team_a_wickets: number;
  team_a_overs: number;
  team_b_runs: number;
  team_b_wickets: number;
  team_b_overs: number;
  current_batting_team_id: string | null;
  ball_by_ball: any[];
  updated_at: string;
}

// Demo accounts
export const demoAccounts: Record<string, MockUser> = {
  'demo@admin.com': {
    id: 'admin-001',
    email: 'demo@admin.com',
    full_name: 'Demo Admin',
    role: 'admin',
    hasActiveSubscription: true
  },
  'demo@viewer.com': {
    id: 'viewer-001',
    email: 'demo@viewer.com',
    full_name: 'Demo Viewer',
    role: 'viewer',
    hasActiveSubscription: true
  },
  'superadmin@demo.com': {
    id: 'superadmin-001',
    email: 'superadmin@demo.com',
    full_name: 'Super Admin',
    role: 'superadmin',
    hasActiveSubscription: true
  }
};

// Initial mock tournaments
export const initialTournaments: MockTournament[] = [
  {
    id: 'tournament-001',
    name: 'IPL 2024',
    description: 'Indian Premier League - The biggest T20 cricket league in the world',
    logo_url: null,
    start_date: '2024-03-22',
    end_date: '2024-05-26',
    venue: 'Multiple Venues',
    overs_format: 20,
    status: 'ongoing',
    admin_id: 'admin-001',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'tournament-002',
    name: 'Cricket World Cup 2024',
    description: 'ICC Cricket World Cup Championship',
    logo_url: null,
    start_date: '2024-06-01',
    end_date: '2024-07-15',
    venue: 'West Indies & USA',
    overs_format: 50,
    status: 'upcoming',
    admin_id: 'admin-001',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: 'tournament-003',
    name: 'Local T20 League',
    description: 'Community cricket championship',
    logo_url: null,
    start_date: '2024-01-01',
    end_date: '2024-02-28',
    venue: 'City Sports Ground',
    overs_format: 20,
    status: 'completed',
    admin_id: 'admin-001',
    created_at: '2023-12-01T00:00:00Z'
  }
];

// Initial mock teams
export const initialTeams: MockTeam[] = [
  {
    id: 'team-001',
    name: 'Mumbai Indians',
    short_name: 'MI',
    logo_url: null,
    captain: 'Hardik Pandya',
    coach: 'Mark Boucher',
    tournament_id: 'tournament-001',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'team-002',
    name: 'Chennai Super Kings',
    short_name: 'CSK',
    logo_url: null,
    captain: 'MS Dhoni',
    coach: 'Stephen Fleming',
    tournament_id: 'tournament-001',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'team-003',
    name: 'Royal Challengers Bangalore',
    short_name: 'RCB',
    logo_url: null,
    captain: 'Faf du Plessis',
    coach: 'Andy Flower',
    tournament_id: 'tournament-001',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'team-004',
    name: 'Kolkata Knight Riders',
    short_name: 'KKR',
    logo_url: null,
    captain: 'Shreyas Iyer',
    coach: 'Chandrakant Pandit',
    tournament_id: 'tournament-001',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'team-005',
    name: 'India',
    short_name: 'IND',
    logo_url: null,
    captain: 'Rohit Sharma',
    coach: 'Rahul Dravid',
    tournament_id: 'tournament-002',
    created_at: '2024-01-21T00:00:00Z'
  },
  {
    id: 'team-006',
    name: 'Australia',
    short_name: 'AUS',
    logo_url: null,
    captain: 'Pat Cummins',
    coach: 'Andrew McDonald',
    tournament_id: 'tournament-002',
    created_at: '2024-01-21T00:00:00Z'
  }
];

// Initial mock players
export const initialPlayers: MockPlayer[] = [
  // Mumbai Indians
  { id: 'player-001', name: 'Rohit Sharma', role: 'batsman', batting_style: 'right-handed', bowling_style: null, jersey_number: 45, team_id: 'team-001', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-002', name: 'Hardik Pandya', role: 'all-rounder', batting_style: 'right-handed', bowling_style: 'medium', jersey_number: 33, team_id: 'team-001', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-003', name: 'Jasprit Bumrah', role: 'bowler', batting_style: 'right-handed', bowling_style: 'fast', jersey_number: 93, team_id: 'team-001', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-004', name: 'Suryakumar Yadav', role: 'batsman', batting_style: 'right-handed', bowling_style: null, jersey_number: 63, team_id: 'team-001', created_at: '2024-01-17T00:00:00Z' },
  
  // Chennai Super Kings
  { id: 'player-005', name: 'MS Dhoni', role: 'wicket-keeper', batting_style: 'right-handed', bowling_style: null, jersey_number: 7, team_id: 'team-002', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-006', name: 'Ravindra Jadeja', role: 'all-rounder', batting_style: 'left-handed', bowling_style: 'spin', jersey_number: 8, team_id: 'team-002', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-007', name: 'Ruturaj Gaikwad', role: 'batsman', batting_style: 'right-handed', bowling_style: null, jersey_number: 31, team_id: 'team-002', created_at: '2024-01-17T00:00:00Z' },
  
  // RCB
  { id: 'player-008', name: 'Virat Kohli', role: 'batsman', batting_style: 'right-handed', bowling_style: null, jersey_number: 18, team_id: 'team-003', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-009', name: 'Glenn Maxwell', role: 'all-rounder', batting_style: 'right-handed', bowling_style: 'spin', jersey_number: 32, team_id: 'team-003', created_at: '2024-01-17T00:00:00Z' },
  
  // KKR
  { id: 'player-010', name: 'Andre Russell', role: 'all-rounder', batting_style: 'right-handed', bowling_style: 'fast', jersey_number: 12, team_id: 'team-004', created_at: '2024-01-17T00:00:00Z' },
  { id: 'player-011', name: 'Sunil Narine', role: 'bowler', batting_style: 'left-handed', bowling_style: 'spin', jersey_number: 74, team_id: 'team-004', created_at: '2024-01-17T00:00:00Z' }
];

// Initial mock matches
export const initialMatches: MockMatch[] = [
  {
    id: 'match-001',
    tournament_id: 'tournament-001',
    team_a_id: 'team-001',
    team_b_id: 'team-002',
    match_date: new Date().toISOString(),
    venue: 'Wankhede Stadium, Mumbai',
    overs: 20,
    status: 'live',
    created_at: '2024-03-22T00:00:00Z'
  },
  {
    id: 'match-002',
    tournament_id: 'tournament-001',
    team_a_id: 'team-003',
    team_b_id: 'team-004',
    match_date: new Date(Date.now() + 86400000).toISOString(),
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    overs: 20,
    status: 'upcoming',
    created_at: '2024-03-22T00:00:00Z'
  },
  {
    id: 'match-003',
    tournament_id: 'tournament-001',
    team_a_id: 'team-002',
    team_b_id: 'team-004',
    match_date: new Date(Date.now() - 86400000).toISOString(),
    venue: 'MA Chidambaram Stadium, Chennai',
    overs: 20,
    status: 'completed',
    created_at: '2024-03-20T00:00:00Z'
  },
  {
    id: 'match-004',
    tournament_id: 'tournament-002',
    team_a_id: 'team-005',
    team_b_id: 'team-006',
    match_date: new Date(Date.now() + 604800000).toISOString(),
    venue: 'Nassau County Stadium, New York',
    overs: 50,
    status: 'upcoming',
    created_at: '2024-01-25T00:00:00Z'
  }
];

// Initial mock scores
export const initialScores: MockMatchScore[] = [
  {
    id: 'score-001',
    match_id: 'match-001',
    team_a_runs: 145,
    team_a_wickets: 3,
    team_a_overs: 15.2,
    team_b_runs: 0,
    team_b_wickets: 0,
    team_b_overs: 0,
    current_batting_team_id: 'team-001',
    ball_by_ball: [],
    updated_at: new Date().toISOString()
  },
  {
    id: 'score-002',
    match_id: 'match-002',
    team_a_runs: 0,
    team_a_wickets: 0,
    team_a_overs: 0,
    team_b_runs: 0,
    team_b_wickets: 0,
    team_b_overs: 0,
    current_batting_team_id: null,
    ball_by_ball: [],
    updated_at: new Date().toISOString()
  },
  {
    id: 'score-003',
    match_id: 'match-003',
    team_a_runs: 178,
    team_a_wickets: 6,
    team_a_overs: 20,
    team_b_runs: 165,
    team_b_wickets: 8,
    team_b_overs: 20,
    current_batting_team_id: null,
    ball_by_ball: [],
    updated_at: new Date().toISOString()
  },
  {
    id: 'score-004',
    match_id: 'match-004',
    team_a_runs: 0,
    team_a_wickets: 0,
    team_a_overs: 0,
    team_b_runs: 0,
    team_b_wickets: 0,
    team_b_overs: 0,
    current_batting_team_id: null,
    ball_by_ball: [],
    updated_at: new Date().toISOString()
  }
];

// Mock admin users for superadmin panel
export const mockAdminUsers = [
  {
    id: 'admin-001',
    email: 'demo@admin.com',
    full_name: 'Demo Admin',
    role: 'admin' as const,
    created_at: '2024-01-01T00:00:00Z',
    hasPurchased: true
  },
  {
    id: 'admin-002',
    email: 'john@example.com',
    full_name: 'John Smith',
    role: 'admin' as const,
    created_at: '2024-02-15T00:00:00Z',
    hasPurchased: true
  }
];

// Mock viewer subscriptions
export const mockViewerSubscriptions = [
  {
    id: 'sub-001',
    user_id: 'viewer-001',
    amount: 20,
    start_date: '2024-01-01',
    expiry_date: '2025-01-01',
    is_active: true
  }
];

// Payment settings
export const initialPaymentSettings = {
  viewer_subscription_amount: 20,
  viewer_validity_days: 30,
  admin_purchase_amount: 500,
  admin_validity_days: 365,
  razorpay_key_id: ''
};

// Helper to get data from localStorage with fallback to initial data
export const getStoredData = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// Helper to store data in localStorage
export const setStoredData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store data:', error);
  }
};

// Initialize mock data in localStorage if not present
export const initializeMockData = () => {
  if (!localStorage.getItem('mock_tournaments')) {
    setStoredData('mock_tournaments', initialTournaments);
  }
  if (!localStorage.getItem('mock_teams')) {
    setStoredData('mock_teams', initialTeams);
  }
  if (!localStorage.getItem('mock_players')) {
    setStoredData('mock_players', initialPlayers);
  }
  if (!localStorage.getItem('mock_matches')) {
    setStoredData('mock_matches', initialMatches);
  }
  if (!localStorage.getItem('mock_scores')) {
    setStoredData('mock_scores', initialScores);
  }
  if (!localStorage.getItem('mock_payment_settings')) {
    setStoredData('mock_payment_settings', initialPaymentSettings);
  }
};
