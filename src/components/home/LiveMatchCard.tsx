import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Team {
  name: string;
  shortName: string;
  score?: string;
  overs?: string;
  logo?: string;
}

interface LiveMatchCardProps {
  teamA: Team;
  teamB: Team;
  tournament: string;
  status: "live" | "upcoming" | "completed";
  venue?: string;
  matchInfo?: string;
  delay?: number;
}

const LiveMatchCard = ({ 
  teamA, 
  teamB, 
  tournament, 
  status, 
  venue, 
  matchInfo,
  delay = 0 
}: LiveMatchCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gradient-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{tournament}</span>
        {status === "live" && (
          <Badge className="bg-gradient-live text-live-foreground border-0 animate-pulse-live">
            <span className="w-1.5 h-1.5 bg-live-foreground rounded-full mr-1.5" />
            LIVE
          </Badge>
        )}
        {status === "upcoming" && (
          <Badge variant="outline" className="border-accent text-accent">UPCOMING</Badge>
        )}
        {status === "completed" && (
          <Badge variant="secondary">COMPLETED</Badge>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-4">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <span className="font-display text-lg">{teamA.shortName.charAt(0)}</span>
            </div>
            <div>
              <div className="font-semibold">{teamA.name}</div>
              <div className="text-xs text-muted-foreground">{teamA.shortName}</div>
            </div>
          </div>
          {teamA.score && (
            <div className="text-right">
              <div className="font-display text-2xl">{teamA.score}</div>
              {teamA.overs && <div className="text-xs text-muted-foreground">{teamA.overs} overs</div>}
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">VS</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <span className="font-display text-lg">{teamB.shortName.charAt(0)}</span>
            </div>
            <div>
              <div className="font-semibold">{teamB.name}</div>
              <div className="text-xs text-muted-foreground">{teamB.shortName}</div>
            </div>
          </div>
          {teamB.score && (
            <div className="text-right">
              <div className="font-display text-2xl">{teamB.score}</div>
              {teamB.overs && <div className="text-xs text-muted-foreground">{teamB.overs} overs</div>}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {(venue || matchInfo) && (
        <div className="mt-4 pt-4 border-t border-border">
          {matchInfo && <div className="text-sm text-accent font-medium">{matchInfo}</div>}
          {venue && <div className="text-xs text-muted-foreground mt-1">{venue}</div>}
        </div>
      )}
    </motion.div>
  );
};

export default LiveMatchCard;
