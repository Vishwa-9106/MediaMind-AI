import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProcessingLoader from '@/components/ProcessingLoader';
import { checkStatus } from '@/lib/api';

const Process = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting analysis...');

  useEffect(() => {
    if (!id) {
      navigate('/upload');
      return;
    }

    let intervalId: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const status = await checkStatus(id);
        setProgress(status.progress);
        setMessage(status.message || 'Processing...');

        if (status.status === 'completed') {
          clearInterval(intervalId);
          setTimeout(() => {
            navigate(`/result/${id}`);
          }, 1000);
        } else if (status.status === 'failed') {
          clearInterval(intervalId);
          setMessage('Processing failed. Please try again.');
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    // Initial check
    pollStatus();

    // Poll every 2 seconds
    intervalId = setInterval(pollStatus, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">Processing Your Media</h1>
            <p className="text-xl text-muted-foreground">
              Our AI is working its magic
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <ProcessingLoader progress={progress} message={message} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Process;
