
import React, { useState, useEffect, useCallback } from 'react';
import { useCyberSecurity } from './CyberSecurityContext';
import { RiskLevel, Module } from '../types';

interface ModuleFooterProps {
  module: Module; // Pass the current module to get module-specific tips
}

// Helper function to map numerical value to risk level
const valueToRiskLevel = (value: number): RiskLevel => {
  if (value <= 20) return 'Critical';
  if (value <= 40) return 'High';
  if (value <= 70) return 'Medium';
  return 'Low';
};

// Colors for risk levels (consistent with CyberRiskScoreDashboard)
const RISK_COLORS: Record<RiskLevel, string> = {
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
};

const DEFAULT_TIPS = [
  "Stay vigilant: Always question unexpected requests for personal information.",
  "Backup regularly: Protect your data from loss due to hardware failure or cyber attack.",
  "Use strong passwords: A mix of characters, numbers, and symbols makes it harder to crack.",
  "Update your software: Keep all your devices and apps up-to-date for the latest security patches.",
  "Think before you click: Phishing links can look very convincing.",
];

export const ModuleFooter: React.FC<ModuleFooterProps> = ({ module }) => {
  const { userProfile } = useCyberSecurity();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tipsToDisplay = module.tips && module.tips.length > 0 ? module.tips : DEFAULT_TIPS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tipsToDisplay.length);
    }, 7000); // Change tip every 7 seconds
    return () => clearInterval(timer);
  }, [tipsToDisplay]);

  const riskLevel = valueToRiskLevel(userProfile.overallScore);

  // Derive a darker background for the footer based on the module's appBgClass
  // Example: bg-blue-100 -> bg-blue-900, bg-emerald-100 -> bg-emerald-900
  const footerBgClass = module.appBgClass.replace(/-\d{2,3}$/, '-900');


  return (
    <div className={`mt-8 p-6 rounded-lg shadow-md text-white ${footerBgClass} border border-gray-700`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Section 1: Cyber Safety Score */}
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold mb-1 text-gray-300">Your Overall Cyber Safety:</p>
          <p className="text-3xl font-extrabold leading-none text-white">
            {userProfile.overallScore}
            <span className="text-xl">/100</span>
          </p>
          <p className={`text-xl font-bold ${RISK_COLORS[riskLevel]}`}>
            {riskLevel} Risk
          </p>
        </div>

        {/* Section 2: Emergency Contact */}
        <div className="text-center md:text-center">
          <p className="text-sm font-semibold mb-1 text-gray-300">Emergency Cyber Contact:</p>
          <p className="text-lg font-bold text-white">1-800-SECURE-ME</p>
          <p className="text-xs italic text-gray-400 opacity-80">(Fictional. Real emergency numbers vary by region.)</p>
        </div>

        {/* Section 3: Rotating Tips */}
        <div className="text-center md:text-right h-20 flex items-center justify-center">
          <p className="text-md font-medium max-w-xs md:max-w-none transition-opacity duration-1000 ease-in-out opacity-100 text-gray-200">
            <strong>Cyber Tip:</strong> {tipsToDisplay[currentTipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};