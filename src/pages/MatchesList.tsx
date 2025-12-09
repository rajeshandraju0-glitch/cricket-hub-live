import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Play,
  Plus,
  Clock
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Match {
  id: string;
  match_date: string;
  venue: string;
  status: string | null;
  overs: number | null;
  team_a: { name: string; short_name: string | null } | null;
  team_b: { name: string; short_name: string | null } | null;
  tournament: { name: string } | null;
  scores: {
    team_a_runs: number | null;
    team_a_wickets: number | null;
    team_a_overs: number | null;
    team_b_runs: number | null;
    team_b_wickets: number | null;
    team_b_overs: number | null;
  } | null;
}

const MatchesList = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user, isAdmin, hasActiveSubscription, isSuperAdmin } = useAuth();

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const fetchMatches = async () => {
    let query = supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(name, short_name),
        team_b:teams!matches_team_b_id_fkey(name, short_name),
        tournament:tournaments(name),
        scores:match_scores(team_a_runs, team_a_wickets, team_a_overs, team_b_runs, team_b_wickets, team_b_overs)
      `)
      .order('match_date', { ascending: false });

    const { data, error } = await query;

    if (!error && data) {
      // Normalize scores to be single object instead of array
      const normalizedData = data.map(m => ({
        ...m,
        scores: Array.isArray(m.scores) && m.scores.length > 0 ? m.scores[0] : null
      }));
      setMatches(normalizedData);
    }
    setLoading(false);
  };

  const filteredMatches = matches.filter(m => {
    if (activeTab === 'all') return true;
    return m.status === activeTab;
  });

  const canViewLive = isAdmin || isSuperAdmin || hasActiveSubscription;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'live':
        return 'bg-live text-live-foreground animate-pulse-live';
      case 'upcoming':
        return 'bg-accent text-accent-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-5xl md:text-6xl mb-2">MATCHES</h1>
                <p className="text-muted-foreground">Track live scores and browse all matches</p>
              </div>
              {isAdmin && (
                <Button variant="hero" asChild>
                  <Link to="/schedule-match">
                    <Plus className="w-5 h-5 mr-2" />
                    Schedule Match
                  </Link>
                </Button>
              )}
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-card border border-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary">All</TabsTrigger>
                  <TabsTrigger value="live" className="data-[state=active]:bg-live">Live</TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-accent">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-secondary">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Matches Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                    <div className="h-6 bg-secondary rounded w-3/4 mb-4" />
                    <div className="h-4 bg-secondary rounded w-1/2 mb-2" />
                    <div className="h-4 bg-secondary rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-2xl mb-2">NO MATCHES FOUND</h3>
                <p className="text-muted-foreground mb-6">
                  {isAdmin ? 'Schedule your first match' : 'No matches available'}
                </p>
                {isAdmin && (
                  <Button variant="hero" asChild>
                    <Link to="/schedule-match">
                      <Plus className="w-5 h-5 mr-2" />
                      Schedule Match
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">
                        {match.tournament?.name}
                      </span>
                      <Badge className={getStatusBadge(match.status)}>
                        {match.status === 'live' ? 'LIVE' : match.status?.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Teams */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="font-display text-sm text-primary-foreground">
                              {match.team_a?.short_name || match.team_a?.name?.substring(0, 2).toUpperCase() || 'TBA'}
                            </span>
                          </div>
                          <span className="font-medium">{match.team_a?.name || 'TBA'}</span>
                        </div>
                        {match.scores && (
                          <span className="font-display text-xl">
                            {match.scores.team_a_runs}/{match.scores.team_a_wickets}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                            <span className="font-display text-sm text-accent-foreground">
                              {match.team_b?.short_name || match.team_b?.name?.substring(0, 2).toUpperCase() || 'TBA'}
                            </span>
                          </div>
                          <span className="font-medium">{match.team_b?.name || 'TBA'}</span>
                        </div>
                        {match.scores && (
                          <span className="font-display text-xl">
                            {match.scores.team_b_runs}/{match.scores.team_b_wickets}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(match.match_date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{match.venue}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    {match.status === 'live' && (
                      <div className="mt-4">
                        {canViewLive ? (
                          <Button variant="hero" size="sm" className="w-full" asChild>
                            <Link to={`/live-scoring/${match.id}`}>
                              <Play className="w-4 h-4 mr-2" />
                              {isAdmin ? 'Score Match' : 'Watch Live'}
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to="/subscribe">
                              Subscribe to Watch Live
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                    {match.status === 'upcoming' && isAdmin && (
                      <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                        <Link to={`/live-scoring/${match.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Match
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MatchesList;
