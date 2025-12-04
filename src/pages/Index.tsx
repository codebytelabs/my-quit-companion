import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { isOnboarded } = useApp();

  if (isOnboarded) {
    return <Navigate to="/home" replace />;
  }

  return <OnboardingFlow />;
};

export default Index;
