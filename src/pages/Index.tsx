import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI models analyze your content with precision and depth',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get comprehensive explanations in seconds, not hours',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your files are processed securely and deleted after analysis',
    },
    {
      icon: Globe,
      title: 'Any Media Type',
      description: 'Works with videos, images, PDFs, and online links',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6 inline-block"
          >
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Understand Any Media
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Instantly with AI
            </span>
          </h1>

          <p className="mb-12 text-xl text-muted-foreground md:text-2xl">
            Upload videos, images, PDFs, or links and get AI-powered explanations
            <br className="hidden md:inline" />
            tailored to any audience—from experts to children
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/upload">
              <Button
                size="lg"
                className="group h-14 gap-2 rounded-2xl px-8 text-lg ai-gradient ai-gradient-hover shadow-glow transition-smooth"
              >
                Start Analyzing
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/history">
              <Button
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl border-2 px-8 text-lg transition-smooth hover:border-primary"
              >
                View Examples
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Powered by Advanced AI</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to understand any content
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card group rounded-3xl p-8 text-center transition-smooth hover:border-primary/50 hover:shadow-glow"
              >
                <div className="mb-4 inline-block rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 transition-smooth group-hover:from-primary/20 group-hover:to-accent/20">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-card mx-auto max-w-4xl rounded-3xl p-12 text-center shadow-glow"
        >
          <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Upload your first file and experience AI-powered analysis
          </p>
          <Link to="/upload">
            <Button
              size="lg"
              className="group h-14 gap-2 rounded-2xl px-8 text-lg ai-gradient ai-gradient-hover transition-smooth"
            >
              Try It Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
