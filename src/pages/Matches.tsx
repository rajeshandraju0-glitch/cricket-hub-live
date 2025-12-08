import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LiveMatchCard from "@/components/home/LiveMatchCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allMatches = [
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
    teamA: { name: "Rajasthan Royals", shortName: "RR" },
    teamB: { name: "Sunrisers Hyderabad", shortName: "SRH" },
    tournament: "IPL 2024",
    status: "upcoming" as const,
    matchInfo: "Tomorrow, 7:30 PM",
    venue: "Sawai Mansingh Stadium, Jaipur"
  },
  {
    teamA: { name: "India", shortName: "IND", score: "350/6", overs: "50.0" },
    teamB: { name: "Australia", shortName: "AUS", score: "280/10", overs: "45.3" },
    tournament: "World Cup 2024",
    status: "completed" as const,
    matchInfo: "India won by 70 runs",
    venue: "MCG, Melbourne"
  },
  {
    teamA: { name: "England", shortName: "ENG", score: "287/9", overs: "50.0" },
    teamB: { name: "South Africa", shortName: "SA", score: "290/4", overs: "48.2" },
    tournament: "World Cup 2024",
    status: "completed" as const,
    matchInfo: "South Africa won by 6 wickets",
    venue: "Lord's, London"
  },
];

const Matches = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredMatches = activeTab === "all" 
    ? allMatches 
    : allMatches.filter(m => m.status === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-display text-5xl md:text-6xl mb-2">MATCHES</h1>
            <p className="text-muted-foreground">Track live scores and browse all matches</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-card border border-border">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary">All</TabsTrigger>
                <TabsTrigger value="live" className="data-[state=active]:bg-live">Live</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-accent">Upcoming</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-secondary">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Match Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match, index) => (
              <LiveMatchCard key={index} {...match} delay={index * 0.05} />
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No matches found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Matches;
