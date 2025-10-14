import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, Video, FileText, Link as LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
}

const FileUploader = ({ onFileSelect, onUrlSubmit }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (type === 'application/pdf') return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          {...getRootProps()}
          className={cn(
            'glass-card group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300',
            isDragActive
              ? 'border-primary bg-primary/5 shadow-glow'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          )}
        >
          <input {...getInputProps()} />
          
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={cn(
              'rounded-2xl p-6 transition-smooth',
              isDragActive ? 'ai-gradient text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}>
              <Upload className="h-12 w-12" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {isDragActive ? 'Drop your file here' : 'Drop files or click to upload'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Supports images, videos, PDFs • Max 100MB
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* File Preview */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card overflow-hidden rounded-2xl p-6"
          >
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  {getFileIcon(selectedFile.type)}
                </div>
              )}
              
              <div className="flex-1 space-y-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  className="ai-gradient ai-gradient-hover transition-smooth"
                >
                  Process File
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or paste a link</span>
        </div>
      </div>

      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            className="h-12 rounded-2xl border-2 pl-10 transition-smooth focus:border-primary"
          />
        </div>
        <Button
          onClick={handleUrlSubmit}
          disabled={!urlInput.trim()}
          className="h-12 rounded-2xl px-8 ai-gradient ai-gradient-hover transition-smooth"
        >
          Process Link
        </Button>
      </motion.div>
    </div>
  );
};

export default FileUploader;
