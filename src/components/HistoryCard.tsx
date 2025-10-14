import { motion } from 'framer-motion';
import { File, Image, Video, FileText, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HistoryCardProps {
  id: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  thumbnail?: string;
  simpleSummary: string;
}

const HistoryCard = ({
  id,
  filename,
  fileType,
  uploadedAt,
  thumbnail,
  simpleSummary,
}: HistoryCardProps) => {
  const getFileIcon = () => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (fileType.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group glass-card overflow-hidden rounded-2xl border-2 transition-smooth hover:border-primary/50 hover:shadow-glow">
        <div className="relative aspect-video overflow-hidden bg-secondary">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={filename}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-secondary-foreground">
              {getFileIcon()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold truncate">{filename}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {simpleSummary}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(uploadedAt)}
            </div>

            <Link to={`/result/${id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="group/btn gap-1 rounded-xl transition-smooth hover:ai-gradient hover:text-primary-foreground"
              >
                View
                <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HistoryCard;
