import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/useThemeStore';
import { motion } from 'framer-motion';
import AuthButton from '@/components/AuthButton';

const Navbar = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/history', label: 'History' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            MediaMind AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'secondary' : 'ghost'}
                className="transition-smooth"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <AuthButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl transition-smooth hover:bg-secondary"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;