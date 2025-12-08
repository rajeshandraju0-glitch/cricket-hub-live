import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LiveMatchCard from "./LiveMatchCard";

const liveMatches = [
  {
    teamA: { name: "Mumbai Indians", shortName: "MI", score: "185/4", overs: "18.2" },
    teamB: { name: "Chennai Super Kings", shortName: "CSK", score: "156/10", overs: "19.4" },
    tournament: "IPL 2024",
    status: "live" as const,
    matchInfo: "MI need 30 runs from 10 balls",
    venue: "Wankhede Stadium, Mumbai"
  },
  {
    teamA: { name: "Royal Challengers", shortName: "RCB", score: "210/3", overs: "20.0" },
    teamB: { name: "Delhi Capitals", shortName: "DC", score: "45/1", overs: "5.2" },
    tournament: "IPL 2024",
    status: "live" as const,
    matchInfo: "DC need 166 runs from 88 balls",
    venue: "M. Chinnaswamy Stadium, Bangalore"
  },
  {
    teamA: { name: "Kolkata Knight Riders", shortName: "KKR" },
    teamB: { name: "Punjab Kings", shortName: "PBKS" },
    tournament: "IPL 2024",
    status: "upcoming" as const,
    matchInfo: "Starts in 2 hours",
    venue: "Eden Gardens, Kolkata"
  },
  {
    teamA: { name: "India", shortName: "IND", score: "350/6", overs: "50.0" },
    teamB: { name: "Australia", shortName: "AUS", score: "280/10", overs: "45.3" },
    tournament: "World Cup 2024",
    status: "completed" as const,
    matchInfo: "India won by 70 runs",
    venue: "MCG, Melbourne"
  },
];

const LiveMatchesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-6xl mb-2">
              LIVE <span className="text-gradient-accent">MATCHES</span>
            </h2>
            <p className="text-muted-foreground max-w-md">
              Track every ball, every run in real-time. Never miss a moment of the action.
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 group" asChild>
            <Link to="/matches">
              View All Matches 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Match Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveMatches.map((match, index) => (
            <LiveMatchCard key={index} {...match} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveMatchesSection;
