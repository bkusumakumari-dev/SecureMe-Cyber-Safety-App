
import React, { createContext, useContext } from 'react';
import { UserRiskProfile } from '../types';

interface CyberSecurityContextType {
  userProfile: UserRiskProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserRiskProfile>>;
}

export const CyberSecurityContext = createContext<CyberSecurityContextType | undefined>(undefined);

export const useCyberSecurity = () => {
  const context = useContext(CyberSecurityContext);
  if (!context) {
    throw new Error('useCyberSecurity must be used within a CyberSecurityProvider');
  }
  return context;
};
