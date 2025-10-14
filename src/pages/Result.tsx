import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ResultTabs from '@/components/ResultTabs';
import { Button } from '@/components/ui/button';
import { getResult, ResultData } from '@/lib/api';
import { toast } from 'sonner';

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      if (!id) {
        navigate('/upload');
        return;
      }

      try {
        const data = await getResult(id);
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
        toast.error('Failed to load results');
        navigate('/upload');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MediaMind AI Result',
        text: result?.results.simpleSummary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const content = `
# ${result.filename}

## Simple Summary
${result.results.simpleSummary}

## Detailed Explanation
${result.results.detailedExplanation}

## Child-Friendly Version
${result.results.childFriendly}

## Storytelling Style
${result.results.storytelling}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.filename}-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl"
        >
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link to="/history">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl transition-smooth hover:bg-secondary"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{result.filename}</h1>
                <p className="text-sm text-muted-foreground">
                  Uploaded {new Date(result.uploadedAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-2 transition-smooth hover:border-primary"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                className="gap-2 rounded-xl ai-gradient ai-gradient-hover transition-smooth"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Thumbnail */}
          {result.thumbnail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 overflow-hidden rounded-3xl"
            >
              <img
                src={result.thumbnail}
                alt={result.filename}
                className="h-64 w-full object-cover"
              />
            </motion.div>
          )}

          {/* Results Tabs */}
          <ResultTabs results={result.results} />

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link to="/upload">
              <Button
                size="lg"
                className="gap-2 rounded-2xl ai-gradient ai-gradient-hover transition-smooth"
              >
                Analyze Another File
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
