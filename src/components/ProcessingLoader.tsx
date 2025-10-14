import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProcessingLoaderProps {
  progress: number;
  message?: string;
}

const ProcessingLoader = ({ progress, message = 'AI is analyzing your content...' }: ProcessingLoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-12">
      {/* Animated Icons */}
      <div className="relative h-32 w-32">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0"
        >
          <div className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-2xl bg-primary/20 p-2">
            <Sparkles className="h-full w-full text-primary" />
          </div>
          <div className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-2xl bg-accent/20 p-2">
            <Zap className="h-full w-full text-accent" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-4 shadow-glow">
            <Brain className="h-12 w-12 text-primary-foreground" />
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="text-center space-y-2">
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium"
          >
            {message}
          </motion.p>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Uploading', complete: progress > 20 },
          { label: 'Analyzing', complete: progress > 60 },
          { label: 'Generating', complete: progress > 90 },
        ].map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-2xl p-4 text-center transition-smooth ${
              step.complete ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <div className="text-sm font-medium">{step.label}</div>
            {step.complete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 text-primary"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingLoader;
