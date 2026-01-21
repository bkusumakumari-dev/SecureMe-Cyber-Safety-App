
import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { UserRiskProfile, RiskLevel, Module } from '../types';
import { Button } from './Button';
import { generateGeminiContent } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { useCyberSecurity } from './CyberSecurityContext'; // Import useCyberSecurity context

interface CyberRiskScoreDashboardProps {
  module: Module; // Accept module prop for ModuleFooter
}

// Helper function to map risk level to a numerical value
const riskLevelToValue = (level: RiskLevel): number => {
  switch (level) {
    case 'Critical': return 0; // Highest risk
    case 'High': return 25;
    case 'Medium': return 50;
    case 'Low': return 75; // Lowest risk
    default: return 50;
  }
};

// Helper function to map numerical value to risk level
const valueToRiskLevel = (value: number): RiskLevel => {
  if (value <= 20) return 'Critical';
  if (value <= 40) return 'High';
  if (value <= 70) return 'Medium';
  return 'Low';
};

// Colors for risk levels
const RISK_COLORS = {
  Critical: '#ef4444', // Red-500
  High: '#f97316',     // Orange-500
  Medium: '#eab308',   // Yellow-500
  Low: '#22c55e',      // Green-500
};

export const CyberRiskScoreDashboard: React.FC<CyberRiskScoreDashboardProps> = ({ module }) => {
  const { userProfile, setUserProfile } = useCyberSecurity(); // Use context for userProfile
  const [riskAssessment, setRiskAssessment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardContentVisible, setDashboardContentVisible] = useState(false); // State to control visibility

  // Function to calculate overall score based on individual risk levels
  const calculateOverallScore = useCallback((profile: UserRiskProfile): number => {
    const scores = [
      riskLevelToValue(profile.breachExposure),
      riskLevelToValue(profile.phishingVulnerability),
      riskLevelToValue(profile.passwordStrength),
      riskLevelToValue(profile.networkSecurity),
      riskLevelToValue(profile.devicePrivacy),
    ];
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(averageScore);
  }, []);

  // Effect to update overall score when individual risks change
  useEffect(() => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      overallScore: calculateOverallScore(prevProfile),
    }));
  }, [userProfile.breachExposure, userProfile.phishingVulnerability, userProfile.passwordStrength, userProfile.networkSecurity, userProfile.devicePrivacy, calculateOverallScore, setUserProfile]);


  // Simulate dynamic risk profile adjustments (e.g., from other modules)
  const simulateRiskAdjustment = useCallback(() => {
    setDashboardContentVisible(true); // Show content on new profile generation
    const newProfile: UserRiskProfile = {
      breachExposure: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as RiskLevel,
      phishingVulnerability: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as RiskLevel,
      passwordStrength: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as RiskLevel,
      networkSecurity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as RiskLevel,
      devicePrivacy: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as RiskLevel,
      overallScore: 0, // Will be recalculated by useEffect
    };
    setUserProfile(newProfile); // Update context with new profile
  }, [setUserProfile]);

  const getGeminiRiskAssessment = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRiskAssessment(null);
    setDashboardContentVisible(true); // Show content when assessment is requested
    try {
      const prompt = `Based on the following cyber risk profile:
      - Breach Exposure: ${userProfile.breachExposure}
      - Phishing Vulnerability: ${userProfile.phishingVulnerability}
      - Password Strength: ${userProfile.passwordStrength}
      - Network Security: ${userProfile.networkSecurity}
      - Device Privacy: ${userProfile.devicePrivacy}
      - Overall Score: ${userProfile.overallScore}/100 (where 100 is excellent)

      Provide a concise overall assessment of the user's cyber safety posture. Highlight the strongest and weakest areas and give 2-3 general, actionable recommendations to improve the weakest areas.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 300 });
      setRiskAssessment(response);
    } catch (err) {
      setError(`Failed to get risk assessment. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const chartData = [
    { name: 'Breach Exposure', value: riskLevelToValue(userProfile.breachExposure), risk: userProfile.breachExposure },
    { name: 'Phishing Vulnerability', value: riskLevelToValue(userProfile.phishingVulnerability), risk: userProfile.phishingVulnerability },
    { name: 'Password Strength', value: riskLevelToValue(userProfile.passwordStrength), risk: userProfile.passwordStrength },
    { name: 'Network Security', value: riskLevelToValue(userProfile.networkSecurity), risk: userProfile.networkSecurity },
    { name: 'Device Privacy', value: riskLevelToValue(userProfile.devicePrivacy), risk: userProfile.devicePrivacy },
  ];

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl max-w-4xl mx-auto border border-gray-700 text-gray-100">
      <h2 className="text-2xl font-bold text-white mb-4">Cyber Risk Score Dashboard</h2>
      <p className="text-gray-300 mb-6">
        This dashboard provides an overview of your cyber safety posture.
        Your overall score and a breakdown of contributing factors are shown below.
        <strong className="text-red-400"> Note: Risk scores are based on AI-powered assessments within this application.</strong>
      </p>

      {!dashboardContentVisible && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-300 mb-6">Click below to view your personalized cyber risk dashboard.</p>
          <Button onClick={() => setDashboardContentVisible(true)} customBgClass="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
            View Your Dashboard
          </Button>
        </div>
      )}

      {dashboardContentVisible && (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between bg-purple-900/40 p-6 rounded-lg mb-6 border border-purple-700">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm font-semibold text-purple-200">Overall Cyber Risk Score:</p>
              <p className="text-6xl font-extrabold text-white leading-none">
                {userProfile.overallScore}
                <span className="text-2xl text-purple-400">/100</span>
              </p>
              <p className={`text-xl font-bold`} style={{ color: RISK_COLORS[valueToRiskLevel(userProfile.overallScore)] }}>
                {valueToRiskLevel(userProfile.overallScore)} Risk
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button onClick={simulateRiskAdjustment} variant="secondary" fullWidth={false} className="w-full md:w-auto">
                Generate New Risk Profile
              </Button>
              <Button onClick={getGeminiRiskAssessment} disabled={loading} fullWidth={false} className="w-full md:w-auto" customBgClass="bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-fuchsia-500">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner /> Assessing...
                  </span>
                ) : (
                  'Get AI-Powered Assessment'
                )}
              </Button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          {riskAssessment && (
            <div className="bg-green-900/40 p-4 rounded-md mt-6 border border-green-700 text-green-100">
              <h3 className="text-lg font-semibold text-green-200 mb-2">AI-Powered Risk Assessment:</h3>
              <p className="whitespace-pre-wrap">{riskAssessment}</p>
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-4 mt-8">Risk Factors Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-lg text-white mb-3">Individual Risk Levels</h4>
              <ul className="space-y-2">
                {chartData.map((item) => (
                  <li key={item.name} className="flex justify-between items-center text-gray-200">
                    <span>{item.name}:</span>
                    <span className={`font-bold`} style={{ color: RISK_COLORS[item.risk] }}>{item.risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-64">
              <h4 className="font-semibold text-lg text-white mb-3">Risk Distribution</h4>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.risk]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#e5e7eb' }}
                           itemStyle={{ color: '#e5e7eb' }}
                           formatter={(value: number, name: string, props: any) => [`${props.payload.risk} (${value})`, name]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ color: '#e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p>
              <strong className="text-red-400">Disclaimer:</strong> This dashboard provides AI-driven insights into your cyber safety.
              Regularly applying these insights empowers you to strengthen your digital defenses.
            </p>
          </div>
        </>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};