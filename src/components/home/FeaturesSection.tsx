import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Trophy, 
  Users, 
  BarChart3, 
  Smartphone,
  Clock,
  Bell
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Scoring",
    description: "Ball-by-ball updates with zero latency. Watch scores change as they happen.",
    color: "text-accent"
  },
  {
    icon: Trophy,
    title: "Tournament Management",
    description: "Create and manage multiple tournaments with ease. Full scheduling system included.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Add teams, players, and track statistics across all your tournaments.",
    color: "text-gold"
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Super Admin, Admin, and Viewer roles with granular permissions.",
    color: "text-live"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed statistics, player performance, and match analytics.",
    color: "text-accent"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Score matches on the go with our mobile-first scoring interface.",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "Match History",
    description: "Access completed matches anytime. Free for all registered users.",
    color: "text-gold"
  },
  {
    icon: Bell,
    title: "Live Notifications",
    description: "Get instant alerts for wickets, milestones, and match results.",
    color: "text-live"
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            EVERYTHING YOU NEED
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Powerful features designed for tournament organizers, scorers, and cricket enthusiasts.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
