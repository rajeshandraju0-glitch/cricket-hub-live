import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MatchScore {
  id: string;
  match_id: string;
  team_a_runs: number;
  team_a_wickets: number;
  team_a_overs: number;
  team_b_runs: number;
  team_b_wickets: number;
  team_b_overs: number;
  current_batting_team_id: string | null;
  current_bowler: string | null;
  current_striker: string | null;
  current_non_striker: string | null;
  ball_by_ball: any[];
  updated_at: string;
}

export const useRealtimeScores = (matchId: string | null) => {
  const [score, setScore] = useState<MatchScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    // Fetch initial score
    const fetchScore = async () => {
      const { data, error } = await supabase
        .from('match_scores')
        .select('*')
        .eq('match_id', matchId)
        .maybeSingle();

      if (!error && data) {
        setScore(data as MatchScore);
      }
      setLoading(false);
    };

    fetchScore();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`match-scores-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'match_scores',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          if (payload.new) {
            setScore(payload.new as MatchScore);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const updateScore = async (updates: Partial<MatchScore>) => {
    if (!matchId || !score) return;

    const { error } = await supabase
      .from('match_scores')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('match_id', matchId);

    return { error };
  };

  const addBall = async (ball: {
    runs: number;
    isWicket: boolean;
    isWide: boolean;
    isNoBall: boolean;
    isBye: boolean;
    isLegBye: boolean;
  }) => {
    if (!matchId || !score) return;

    const currentBalls = Array.isArray(score.ball_by_ball) ? score.ball_by_ball : [];
    const newBall = {
      ...ball,
      timestamp: new Date().toISOString(),
      over: Math.floor(score.team_a_overs) + 1,
      ballInOver: Math.round((score.team_a_overs % 1) * 10) + 1
    };

    const newBallByBall = [...currentBalls, newBall];
    
    // Calculate new overs (if not a wide or no ball, increment ball count)
    let newOvers = score.team_a_overs;
    if (!ball.isWide && !ball.isNoBall) {
      const currentBallsInOver = Math.round((score.team_a_overs % 1) * 10);
      if (currentBallsInOver >= 5) {
        newOvers = Math.floor(score.team_a_overs) + 1;
      } else {
        newOvers = Math.floor(score.team_a_overs) + (currentBallsInOver + 1) / 10;
      }
    }

    const updates: Partial<MatchScore> = {
      team_a_runs: score.team_a_runs + ball.runs + (ball.isWide || ball.isNoBall ? 1 : 0),
      team_a_wickets: ball.isWicket ? score.team_a_wickets + 1 : score.team_a_wickets,
      team_a_overs: newOvers,
      ball_by_ball: newBallByBall
    };

    return updateScore(updates);
  };

  return { score, loading, updateScore, addBall };
};
