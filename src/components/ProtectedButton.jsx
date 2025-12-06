import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChange } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const ProtectedButton = ({ navigateTo, children, ...props }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
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