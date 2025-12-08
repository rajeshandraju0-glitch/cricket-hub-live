import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertCircle,
  CircleDot,
  RefreshCw
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeScores } from "@/hooks/useRealtimeScores";
import { useToast } from "@/hooks/use-toast";

const LiveScoring = () => {
  const { matchId } = useParams();
  const { score, loading, addBall, updateScore } = useRealtimeScores(matchId || null);
  const [match, setMatch] = useState<any>(null);
  const [currentOver, setCurrentOver] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  const fetchMatch = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(id, name, short_name),
        team_b:teams!matches_team_b_id_fkey(id, name, short_name),
        tournament:tournaments(name)
      `)
      .eq('id', matchId)
      .maybeSingle();

    if (!error && data) {
      setMatch(data);
    }
  };

  const handleAddRun = async (runs: number) => {
    const result = await addBall({
      runs,
      isWicket: false,
      isWide: false,
      isNoBall: false,
      isBye: false,
      isLegBye: false
    });

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update score'
      });
    } else {
      setCurrentOver(prev => [...prev, runs.toString()]);
    }
  };

  const handleWicket = async () => {
    const result = await addBall({
      runs: 0,
      isWicket: true,
      isWide: false,
      isNoBall: false,
      isBye: false,
      isLegBye: false
    });

    if (!result?.error) {
      setCurrentOver(prev => [...prev, 'W']);
    }
  };

  const handleExtra = async (type: 'wide' | 'noball' | 'bye' | 'legbye') => {
    const result = await addBall({
      runs: 1,
      isWicket: false,
      isWide: type === 'wide',
      isNoBall: type === 'noball',
      isBye: type === 'bye',
      isLegBye: type === 'legbye'
    });

    if (!result?.error) {
      const labels: Record<string, string> = {
        wide: 'WD',
        noball: 'NB',
        bye: 'B',
        legbye: 'LB'
      };
      setCurrentOver(prev => [...prev, labels[type]]);
    }
  };

  const handleEndOver = () => {
    setCurrentOver([]);
    toast({
      title: 'Over Completed',
      description: 'Starting new over'
    });
  };

  const undoLast = () => {
    setCurrentOver(prev => prev.slice(0, -1));
    toast({
      title: 'Undo',
      description: 'Last ball removed (note: database not updated)'
    });
  };

  const runButtons = [0, 1, 2, 3, 4, 6];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
              <div className="text-sm text-muted-foreground">
                {match?.tournament?.name || 'Tournament'}
              </div>
              <div className="font-display text-xl">
                {match?.team_a?.short_name || 'Team A'} vs {match?.team_b?.short_name || 'Team B'}
              </div>
            </div>
          </div>
          <Badge className="bg-gradient-live text-live-foreground border-0 animate-pulse-live">
            <CircleDot className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scoreboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="font-display text-2xl mb-6">SCOREBOARD</h2>
            
            {/* Team A Score */}
            <div className="bg-secondary rounded-xl p-6 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                    <span className="font-display text-2xl">{match?.team_a?.short_name || 'A'}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{match?.team_a?.name || 'Team A'}</div>
                    <div className="text-sm text-muted-foreground">Batting</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-5xl animate-score-update">
                    {score?.team_a_runs || 0}/{score?.team_a_wickets || 0}
                  </div>
                  <div className="text-muted-foreground">{score?.team_a_overs || 0} overs</div>
                </div>
              </div>
            </div>

            {/* Team B Score */}
            <div className="bg-muted rounded-xl p-6 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center">
                    <span className="font-display text-2xl">{match?.team_b?.short_name || 'B'}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{match?.team_b?.name || 'Team B'}</div>
                    <div className="text-sm text-muted-foreground">Yet to bat</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-5xl">{score?.team_b_runs || 0}/{score?.team_b_wickets || 0}</div>
                  <div className="text-muted-foreground">{score?.team_b_overs || 0} overs</div>
                </div>
              </div>
            </div>

            {/* This Over */}
            <div className="mt-6 p-4 bg-secondary rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">This Over</span>
                <Button variant="ghost" size="sm" onClick={undoLast}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Undo
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {currentOver.length === 0 ? (
                  <span className="text-muted-foreground text-sm">No balls bowled yet</span>
                ) : (
                  currentOver.map((ball, index) => (
                    <span
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        ball === "W" ? "bg-live text-live-foreground" :
                        ball === "4" || ball === "6" ? "bg-accent text-accent-foreground" :
                        ball === "WD" || ball === "NB" ? "bg-gold text-gold-foreground" :
                        "bg-card text-foreground"
                      }`}
                    >
                      {ball}
                    </span>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Scoring Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <h2 className="font-display text-2xl mb-6">SCORING</h2>

            {/* Run Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {runButtons.map((run) => (
                <Button
                  key={run}
                  variant={run === 4 || run === 6 ? "hero" : "secondary"}
                  size="lg"
                  onClick={() => handleAddRun(run)}
                  className="h-16 font-display text-2xl"
                >
                  {run}
                </Button>
              ))}
            </div>

            {/* Wicket Button */}
            <Button 
              variant="destructive" 
              size="lg" 
              className="w-full h-14 mb-4 font-display text-xl"
              onClick={handleWicket}
            >
              WICKET
            </Button>

            {/* Extras */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Extras</span>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleExtra('wide')}>Wide</Button>
                <Button variant="outline" onClick={() => handleExtra('noball')}>No Ball</Button>
                <Button variant="outline" onClick={() => handleExtra('bye')}>Bye</Button>
                <Button variant="outline" onClick={() => handleExtra('legbye')}>Leg Bye</Button>
              </div>
            </div>

            {/* End Over */}
            <Button variant="gold" className="w-full mt-6" size="lg" onClick={handleEndOver}>
              End Over
            </Button>
          </motion.div>
        </div>

        {/* Match Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 text-accent mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Match Status</span>
          </div>
          <p className="text-muted-foreground">
            {match?.team_a?.name || 'Team A'} batting • {match?.overs || 20} overs match
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default LiveScoring;
