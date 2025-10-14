import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-8"
          >
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold">Page Not Found</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/">
              <Button
                size="lg"
                className="group gap-2 rounded-2xl ai-gradient ai-gradient-hover transition-smooth"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2 rounded-2xl border-2 transition-smooth hover:border-primary"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
