import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  RotateCcw, 
  AlertCircle,
  CircleDot
} from "lucide-react";
import { Link } from "react-router-dom";

const LiveScoring = () => {
  const [runs, setRuns] = useState({ teamA: 156, teamB: 0 });
  const [wickets, setWickets] = useState({ teamA: 4, teamB: 0 });
  const [overs, setOvers] = useState({ teamA: 18.2, teamB: 0 });
  const [currentBall, setCurrentBall] = useState<string[]>([]);

  const addRun = (run: number) => {
    setRuns(prev => ({ ...prev, teamA: prev.teamA + run }));
    setCurrentBall(prev => [...prev, run.toString()]);
  };

  const addWicket = () => {
    setWickets(prev => ({ ...prev, teamA: prev.teamA + 1 }));
    setCurrentBall(prev => [...prev, "W"]);
  };

  const addExtra = (type: string) => {
    setRuns(prev => ({ ...prev, teamA: prev.teamA + 1 }));
    setCurrentBall(prev => [...prev, type]);
  };

  const undoLast = () => {
    setCurrentBall(prev => prev.slice(0, -1));
  };

  const runButtons = [0, 1, 2, 3, 4, 6];

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
              <div className="text-sm text-muted-foreground">IPL 2024 • Match 45</div>
              <div className="font-display text-xl">MI vs CSK</div>
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
                    <span className="font-display text-2xl">MI</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Mumbai Indians</div>
                    <div className="text-sm text-muted-foreground">Batting</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-5xl animate-score-update">{runs.teamA}/{wickets.teamA}</div>
                  <div className="text-muted-foreground">{overs.teamA} overs</div>
                </div>
              </div>
            </div>

            {/* Team B Score */}
            <div className="bg-muted rounded-xl p-6 opacity-60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center">
                    <span className="font-display text-2xl">CSK</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Chennai Super Kings</div>
                    <div className="text-sm text-muted-foreground">Yet to bat</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-5xl">{runs.teamB}/{wickets.teamB}</div>
                  <div className="text-muted-foreground">{overs.teamB} overs</div>
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
                {currentBall.length === 0 ? (
                  <span className="text-muted-foreground text-sm">No balls bowled yet</span>
                ) : (
                  currentBall.map((ball, index) => (
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
                  onClick={() => addRun(run)}
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
              onClick={addWicket}
            >
              WICKET
            </Button>

            {/* Extras */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Extras</span>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => addExtra("WD")}>Wide</Button>
                <Button variant="outline" onClick={() => addExtra("NB")}>No Ball</Button>
                <Button variant="outline" onClick={() => addExtra("B")}>Bye</Button>
                <Button variant="outline" onClick={() => addExtra("LB")}>Leg Bye</Button>
              </div>
            </div>

            {/* End Over */}
            <Button variant="gold" className="w-full mt-6" size="lg">
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
            Mumbai Indians need 30 runs from 10 balls to win. Required run rate: 18.00
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default LiveScoring;
