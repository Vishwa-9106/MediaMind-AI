import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileX, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HistoryCard from '@/components/HistoryCard';
import { Button } from '@/components/ui/button';
import { getHistory, ResultData } from '@/lib/api';

const History = () => {
  const [history, setHistory] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Your History</h1>
              <p className="mt-2 text-xl text-muted-foreground">
                Previously analyzed files
              </p>
            </div>
            <Link to="/upload">
              <Button className="gap-2 rounded-2xl ai-gradient ai-gradient-hover transition-smooth">
                <Plus className="h-5 w-5" />
                New Upload
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card animate-pulse rounded-2xl"
                >
                  <div className="aspect-video bg-secondary" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 rounded bg-secondary" />
                    <div className="h-3 rounded bg-secondary" />
                    <div className="h-3 w-2/3 rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-3xl p-12 text-center"
            >
              <FileX className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-2xl font-semibold">No history yet</h2>
              <p className="mb-6 text-muted-foreground">
                Upload your first file to get started
              </p>
              <Link to="/upload">
                <Button className="gap-2 rounded-2xl ai-gradient ai-gradient-hover transition-smooth">
                  <Plus className="h-5 w-5" />
                  Upload Now
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  id={item.id}
                  filename={item.filename}
                  fileType={item.fileType}
                  uploadedAt={item.uploadedAt}
                  thumbnail={item.thumbnail}
                  simpleSummary={item.results.simpleSummary}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
