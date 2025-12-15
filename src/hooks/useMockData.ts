import { useState, useEffect, useCallback } from 'react';
import {
  getStoredData,
  setStoredData,
  MockTournament,
  MockTeam,
  MockPlayer,
  MockMatch,
  MockMatchScore,
  initialTournaments,
  initialTeams,
  initialPlayers,
  initialMatches,
  initialScores
} from '@/lib/mockData';

// Tournament hooks
export const useTournaments = (adminId?: string) => {
  const [tournaments, setTournaments] = useState<MockTournament[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = useCallback(() => {
    const allTournaments = getStoredData<MockTournament[]>('mock_tournaments', initialTournaments);
    const filtered = adminId 
      ? allTournaments.filter(t => t.admin_id === adminId)
      : allTournaments;
    setTournaments(filtered);
    setLoading(false);
  }, [adminId]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const createTournament = (tournament: Omit<MockTournament, 'id' | 'created_at'>) => {
    const allTournaments = getStoredData<MockTournament[]>('mock_tournaments', initialTournaments);
    const newTournament: MockTournament = {
      ...tournament,
      id: `tournament-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [...allTournaments, newTournament];
    setStoredData('mock_tournaments', updated);
    fetchTournaments();
    return newTournament;
  };

  const deleteTournament = (id: string) => {
    const allTournaments = getStoredData<MockTournament[]>('mock_tournaments', initialTournaments);
    const updated = allTournaments.filter(t => t.id !== id);
    setStoredData('mock_tournaments', updated);
    fetchTournaments();
  };

  return { tournaments, loading, fetchTournaments, createTournament, deleteTournament };
};

// Team hooks
export const useTeams = (tournamentIds?: string[]) => {
  const [teams, setTeams] = useState<MockTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = useCallback(() => {
    const allTeams = getStoredData<MockTeam[]>('mock_teams', initialTeams);
    const filtered = tournamentIds && tournamentIds.length > 0
      ? allTeams.filter(t => tournamentIds.includes(t.tournament_id))
      : allTeams;
    setTeams(filtered);
    setLoading(false);
  }, [tournamentIds]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = (team: Omit<MockTeam, 'id' | 'created_at'>) => {
    const allTeams = getStoredData<MockTeam[]>('mock_teams', initialTeams);
    const newTeam: MockTeam = {
      ...team,
      id: `team-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [...allTeams, newTeam];
    setStoredData('mock_teams', updated);
    fetchTeams();
    return newTeam;
  };

  const deleteTeam = (id: string) => {
    const allTeams = getStoredData<MockTeam[]>('mock_teams', initialTeams);
    const updated = allTeams.filter(t => t.id !== id);
    setStoredData('mock_teams', updated);
    fetchTeams();
  };

  const getTeamById = (id: string) => {
    const allTeams = getStoredData<MockTeam[]>('mock_teams', initialTeams);
    return allTeams.find(t => t.id === id);
  };

  return { teams, loading, fetchTeams, createTeam, deleteTeam, getTeamById };
};

// Player hooks
export const usePlayers = (teamId?: string) => {
  const [players, setPlayers] = useState<MockPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(() => {
    const allPlayers = getStoredData<MockPlayer[]>('mock_players', initialPlayers);
    const filtered = teamId 
      ? allPlayers.filter(p => p.team_id === teamId)
      : allPlayers;
    setPlayers(filtered);
    setLoading(false);
  }, [teamId]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const createPlayer = (player: Omit<MockPlayer, 'id' | 'created_at'>) => {
    const allPlayers = getStoredData<MockPlayer[]>('mock_players', initialPlayers);
    const newPlayer: MockPlayer = {
      ...player,
      id: `player-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [...allPlayers, newPlayer];
    setStoredData('mock_players', updated);
    fetchPlayers();
    return newPlayer;
  };

  const deletePlayer = (id: string) => {
    const allPlayers = getStoredData<MockPlayer[]>('mock_players', initialPlayers);
    const updated = allPlayers.filter(p => p.id !== id);
    setStoredData('mock_players', updated);
    fetchPlayers();
  };

  const getPlayerCountByTeam = (teamId: string) => {
    const allPlayers = getStoredData<MockPlayer[]>('mock_players', initialPlayers);
    return allPlayers.filter(p => p.team_id === teamId).length;
  };

  return { players, loading, fetchPlayers, createPlayer, deletePlayer, getPlayerCountByTeam };
};

// Match hooks
export const useMatches = (tournamentIds?: string[]) => {
  const [matches, setMatches] = useState<MockMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(() => {
    const allMatches = getStoredData<MockMatch[]>('mock_matches', initialMatches);
    const filtered = tournamentIds && tournamentIds.length > 0
      ? allMatches.filter(m => tournamentIds.includes(m.tournament_id))
      : allMatches;
    setMatches(filtered);
    setLoading(false);
  }, [tournamentIds]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const createMatch = (match: Omit<MockMatch, 'id' | 'created_at'>) => {
    const allMatches = getStoredData<MockMatch[]>('mock_matches', initialMatches);
    const newMatch: MockMatch = {
      ...match,
      id: `match-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    const updated = [...allMatches, newMatch];
    setStoredData('mock_matches', updated);

    // Also create score record
    const allScores = getStoredData<MockMatchScore[]>('mock_scores', initialScores);
    const newScore: MockMatchScore = {
      id: `score-${Date.now()}`,
      match_id: newMatch.id,
      team_a_runs: 0,
      team_a_wickets: 0,
      team_a_overs: 0,
      team_b_runs: 0,
      team_b_wickets: 0,
      team_b_overs: 0,
      current_batting_team_id: null,
      ball_by_ball: [],
      updated_at: new Date().toISOString()
    };
    setStoredData('mock_scores', [...allScores, newScore]);

    fetchMatches();
    return newMatch;
  };

  const updateMatchStatus = (matchId: string, status: string) => {
    const allMatches = getStoredData<MockMatch[]>('mock_matches', initialMatches);
    const updated = allMatches.map(m => 
      m.id === matchId ? { ...m, status } : m
    );
    setStoredData('mock_matches', updated);
    fetchMatches();
  };

  const getMatchById = (id: string) => {
    const allMatches = getStoredData<MockMatch[]>('mock_matches', initialMatches);
    return allMatches.find(m => m.id === id);
  };

  return { matches, loading, fetchMatches, createMatch, updateMatchStatus, getMatchById };
};

// Score hooks
export const useScores = () => {
  const getScoreByMatchId = (matchId: string) => {
    const allScores = getStoredData<MockMatchScore[]>('mock_scores', initialScores);
    return allScores.find(s => s.match_id === matchId);
  };

  return { getScoreByMatchId };
};

// Stats hook
export const useStats = (adminId?: string) => {
  const [stats, setStats] = useState({
    tournaments: 0,
    teams: 0,
    matches: 0,
    liveMatches: 0
  });

  useEffect(() => {
    const allTournaments = getStoredData<MockTournament[]>('mock_tournaments', initialTournaments);
    const tournaments = adminId 
      ? allTournaments.filter(t => t.admin_id === adminId)
      : allTournaments;
    const tournamentIds = tournaments.map(t => t.id);

    const allTeams = getStoredData<MockTeam[]>('mock_teams', initialTeams);
    const teams = allTeams.filter(t => tournamentIds.includes(t.tournament_id));

    const allMatches = getStoredData<MockMatch[]>('mock_matches', initialMatches);
    const matches = allMatches.filter(m => tournamentIds.includes(m.tournament_id));
    const liveMatches = matches.filter(m => m.status === 'live');

    setStats({
      tournaments: tournaments.length,
      teams: teams.length,
      matches: matches.length,
      liveMatches: liveMatches.length
    });
  }, [adminId]);

  return stats;
};
