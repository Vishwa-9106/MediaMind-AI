import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChange } from '@/lib/auth';
import { User } from 'firebase/auth';
import { Button, ButtonProps } from '@/components/ui/button';

interface ProtectedButtonProps extends ButtonProps {
  navigateTo: string;
  children: React.ReactNode;
}

const ProtectedButton: React.FC<ProtectedButtonProps> = ({ 
  navigateTo, 
  children, 
  ...props 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user: User | null) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate(navigateTo);
    } else {
      navigate('/auth');
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};

export default ProtectedButton;