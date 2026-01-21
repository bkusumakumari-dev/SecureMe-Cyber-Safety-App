
import React from 'react';

export interface Module {
  id: string;
  name: string;
  description: string;
  howToUse: string;
  component: React.FC;
  cardBgClass: string; // Added for unique card background colors
  appBgClass: string;  // Added for dynamic application background colors
  tips: string[]; // Added for module-specific cyber safety tips
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface UserRiskProfile {
  breachExposure: RiskLevel;
  phishingVulnerability: RiskLevel;
  passwordStrength: RiskLevel;
  networkSecurity: RiskLevel;
  devicePrivacy: RiskLevel;
  overallScore: number; // 0-100
}
