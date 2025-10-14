import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUploader from '@/components/FileUploader';
import { uploadFile, uploadFromUrl } from '@/lib/api';
import { useUploadStore } from '@/store/useUploadStore';
import { toast } from 'sonner';

const Upload = () => {
  const navigate = useNavigate();
  const { setIsUploading, setCurrentUploadId, setUploadProgress } = useUploadStore();

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      toast.loading('Uploading file...', { id: 'upload' });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setCurrentUploadId(response.id);

      toast.success('File uploaded successfully!', { id: 'upload' });
      
      setTimeout(() => {
        navigate(`/process/${response.id}`);
      }, 500);
    } catch (error) {
      toast.error('Failed to upload file. Please try again.', { id: 'upload' });
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    try {
      setIsUploading(true);
      toast.loading('Processing URL...', { id: 'upload' });

      const response = await uploadFromUrl(url);
      setCurrentUploadId(response.id);

      toast.success('URL submitted successfully!', { id: 'upload' });
      
      setTimeout(() => {
        navigate(`/process/${response.id}`);
      }, 500);
    } catch (error) {
      toast.error('Failed to process URL. Please try again.', { id: 'upload' });
      console.error('URL error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Upload Your Media
            </h1>
            <p className="text-xl text-muted-foreground">
              Drop any file or paste a link to get started
            </p>
          </div>

          <FileUploader
            onFileSelect={handleFileSelect}
            onUrlSubmit={handleUrlSubmit}
          />

          {/* Supported Formats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Supported Formats
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['MP4', 'MOV', 'AVI', 'JPG', 'PNG', 'GIF', 'PDF', 'URLs'].map((format) => (
                <div
                  key={format}
                  className="glass-card rounded-xl px-4 py-2 text-sm font-medium"
                >
                  {format}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
