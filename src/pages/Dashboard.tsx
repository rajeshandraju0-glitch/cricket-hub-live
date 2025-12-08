import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  Plus, 
  Play,
  ChevronRight,
  Settings,
  LogOut
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { icon: Trophy, label: "Tournaments", value: "12", change: "+2 this month" },
    { icon: Users, label: "Teams", value: "48", change: "+8 this month" },
    { icon: Calendar, label: "Matches", value: "156", change: "24 upcoming" },
    { icon: Play, label: "Live Now", value: "3", change: "Active matches" },
  ];

  const recentMatches = [
    { teamA: "MI", teamB: "CSK", status: "live", score: "185/4 vs 156/10" },
    { teamA: "RCB", teamB: "DC", status: "live", score: "210/3 vs 45/1" },
    { teamA: "KKR", teamB: "PBKS", status: "upcoming", time: "2 hours" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <span className="font-display text-2xl text-accent-foreground">C</span>
            </div>
            <span className="font-display text-xl tracking-wider">SCORE</span>
          </Link>

          <nav className="space-y-1">
            {[
              { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
              { icon: Trophy, label: "Tournaments", href: "/dashboard/tournaments" },
              { icon: Users, label: "Teams", href: "/dashboard/teams" },
              { icon: Calendar, label: "Matches", href: "/dashboard/matches" },
              { icon: Settings, label: "Settings", href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl mb-1">DASHBOARD</h1>
              <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>
            <Button variant="hero">
              <Plus className="w-5 h-5 mr-2" />
              New Tournament
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
                <div className="font-display text-4xl mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Recent Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">RECENT MATCHES</h2>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="font-display text-lg">{match.teamA} vs {match.teamB}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {match.status === "live" && (
                        <>
                          <span className="text-sm text-muted-foreground">{match.score}</span>
                          <span className="px-2 py-1 bg-live text-live-foreground text-xs rounded-full animate-pulse-live">LIVE</span>
                        </>
                      )}
                      {match.status === "upcoming" && (
                        <span className="text-sm text-muted-foreground">in {match.time}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">QUICK ACTIONS</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Trophy, label: "New Tournament", color: "bg-primary" },
                  { icon: Users, label: "Add Team", color: "bg-accent" },
                  { icon: Calendar, label: "Schedule Match", color: "bg-gold" },
                  { icon: Play, label: "Start Scoring", color: "bg-live" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-secondary hover:bg-muted transition-colors"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
