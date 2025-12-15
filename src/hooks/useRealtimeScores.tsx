import { useState, useEffect } from 'react';
import { getStoredData, setStoredData, MockMatchScore, initialScores } from '@/lib/mockData';

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

    // Fetch initial score from localStorage
    const fetchScore = () => {
      const scores = getStoredData<MockMatchScore[]>('mock_scores', initialScores);
      const matchScore = scores.find(s => s.match_id === matchId);
      
      if (matchScore) {
        setScore({
          ...matchScore,
          current_bowler: null,
          current_striker: null,
          current_non_striker: null
        } as MatchScore);
      } else {
        // Create a new score record if none exists
        const newScore: MockMatchScore = {
          id: `score-${Date.now()}`,
          match_id: matchId,
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
        const updatedScores = [...scores, newScore];
        setStoredData('mock_scores', updatedScores);
        setScore({
          ...newScore,
          current_bowler: null,
          current_striker: null,
          current_non_striker: null
        } as MatchScore);
      }
      setLoading(false);
    };

    fetchScore();
  }, [matchId]);

  const updateScore = async (updates: Partial<MatchScore>) => {
    if (!matchId || !score) return { error: null };

    const updatedScore = {
      ...score,
      ...updates,
      updated_at: new Date().toISOString()
    };

    setScore(updatedScore);

    // Update localStorage
    const scores = getStoredData<MockMatchScore[]>('mock_scores', initialScores);
    const updatedScores = scores.map(s => 
      s.match_id === matchId 
        ? { ...s, ...updates, updated_at: new Date().toISOString() }
        : s
    );
    setStoredData('mock_scores', updatedScores);

    return { error: null };
  };

  const addBall = async (ball: {
    runs: number;
    isWicket: boolean;
    isWide: boolean;
    isNoBall: boolean;
    isBye: boolean;
    isLegBye: boolean;
  }) => {
    if (!matchId || !score) return { error: null };

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
