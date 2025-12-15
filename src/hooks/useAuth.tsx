import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { demoAccounts, MockUser, initializeMockData } from '@/lib/mockData';

type UserRole = 'superadmin' | 'admin' | 'viewer';

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasActiveSubscription: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize mock data on app load
    initializeMockData();
    
    // Check for stored session
    const storedUser = localStorage.getItem('mock_current_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('mock_current_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Simulate signup - in demo mode, create a viewer account
    if (password.length < 8) {
      const error = { message: 'Password must be at least 8 characters' };
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message
      });
      return { error };
    }

    // Check if it's a demo account
    if (demoAccounts[email]) {
      const error = { message: 'This email is already registered' };
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message
      });
      return { error };
    }

    // Create new mock user
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      role: 'viewer',
      hasActiveSubscription: false
    };

    // Store in localStorage registered users
    const registeredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '{}');
    registeredUsers[email] = { ...newUser, password };
    localStorage.setItem('mock_registered_users', JSON.stringify(registeredUsers));

    toast({
      title: 'Account created!',
      description: 'You can now sign in to your account.'
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Check demo accounts first (password: "demo123")
    if (demoAccounts[email] && password === 'demo123') {
      const demoUser = demoAccounts[email];
      setUser(demoUser);
      localStorage.setItem('mock_current_user', JSON.stringify(demoUser));
      toast({
        title: 'Welcome!',
        description: `Signed in as ${demoUser.full_name}`
      });
      return { error: null };
    }

    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '{}');
    if (registeredUsers[email] && registeredUsers[email].password === password) {
      const registeredUser = registeredUsers[email];
      const userWithoutPassword = { ...registeredUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('mock_current_user', JSON.stringify(userWithoutPassword));
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${registeredUser.full_name}`
      });
      return { error: null };
    }

    const error = { message: 'Invalid email or password. Try demo@admin.com / demo123' };
    toast({
      variant: 'destructive',
      title: 'Sign in failed',
      description: error.message
    });
    return { error };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('mock_current_user');
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully'
    });
  };

  const value = {
    user,
    session: user ? { user } : null,
    role: user?.role || null,
    loading,
    signUp,
    signIn,
    signOut,
    hasActiveSubscription: user?.hasActiveSubscription || false,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    isSuperAdmin: user?.role === 'superadmin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
