import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Crown, Users, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Viewer",
    icon: Eye,
    price: "₹20",
    period: "/month",
    description: "Perfect for cricket fans who want to follow live matches",
    features: [
      "View all completed matches (FREE)",
      "Watch live matches",
      "Real-time score updates",
      "Match notifications",
      "Basic statistics",
    ],
    cta: "Subscribe Now",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Admin",
    icon: Users,
    price: "₹499",
    period: "/month",
    description: "For tournament organizers and team managers",
    features: [
      "Everything in Viewer",
      "Create unlimited tournaments",
      "Manage teams & players",
      "Live scoring dashboard",
      "Match scheduling",
      "Advanced analytics",
      "Export match data",
    ],
    cta: "Get Admin Access",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Super Admin",
    icon: Crown,
    price: "Custom",
    period: "",
    description: "Enterprise solution for leagues and organizations",
    features: [
      "Everything in Admin",
      "Multiple admin accounts",
      "Revenue management",
      "White-label options",
      "API access",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    variant: "gold" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            SIMPLE <span className="text-gradient-gold">PRICING</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? "bg-gradient-card border-2 border-accent glow-accent" 
                  : "bg-card border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                plan.popular ? "bg-accent/20 text-accent" : "bg-secondary text-foreground"
              }`}>
                <plan.icon className="w-7 h-7" />
              </div>

              {/* Name & Price */}
              <h3 className="font-display text-2xl mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display text-5xl">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 ${plan.popular ? "text-accent" : "text-primary"}`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button variant={plan.variant} className="w-full" size="lg" asChild>
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
