
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { InputField } from './InputField';
import { LoadingSpinner } from './LoadingSpinner';
import { Module } from '../types'; // Import Module type

type BreachStatus = 'safe' | 'unsafe' | 'warning' | null;

interface AccountBreachCheckerProps {
  module: Module; // Accept module prop
}

export const AccountBreachChecker: React.FC<AccountBreachCheckerProps> = ({ module }) => {
  const [email, setEmail] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [breachStatus, setBreachStatus] = useState<BreachStatus>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineStatus = (text: string): BreachStatus => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('no') || lowerText.includes('not compromised') || lowerText.includes('unlikely') || lowerText.includes('appears safe')) {
      return 'safe';
    }
    if (lowerText.includes('yes') || lowerText.includes('compromised') || lowerText.includes('exposed')) {
      return 'unsafe';
    }
    return 'warning';
  };

  const getStatusClasses = (status: BreachStatus) => {
    switch (status) {
      case 'safe':
        return 'bg-green-700 text-green-100 border-green-500';
      case 'unsafe':
        return 'bg-red-700 text-red-100 border-red-500';
      case 'warning':
        return 'bg-yellow-700 text-yellow-100 border-yellow-500';
      default:
        return 'bg-gray-800 text-gray-100 border-gray-600';
    }
  };

  const getStatusText = (status: BreachStatus) => {
    switch (status) {
      case 'safe': return 'ALL CLEAR!';
      case 'unsafe': return 'BREACH DETECTED!';
      case 'warning': return 'CAUTION ADVISED!';
      default: return 'Result';
    }
  };

  const handleCheckBreach = useCallback(async () => {
    setError(null);
    setResultMessage(null);
    setBreachStatus(null);
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Perform an AI-powered analysis to check if the email address "${email}" is likely to have been found in a public data breach. Provide a very concise answer first (e.g., "No breach detected." or "Breach detected.") followed by a brief explanation and recommendations. Example unsafe response: "Yes, the email was found in a breach from 2020. Consider changing your password immediately and enabling 2FA." Example safe response: "No breach detected. Your email appears safe based on our analysis."`;
      const response = await generateGeminiContent(prompt, { temperature: 0.5, maxOutputTokens: 150 });
      setResultMessage(response);
      setBreachStatus(determineStatus(response));
    } catch (err) {
      setError(`Failed to check for breaches. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl md:w-2/3 lg:w-1/2 mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Account Breach Checker</h2>
      <p className="text-gray-300 mb-6">
        Enter your email address below to initiate an AI-powered check for potential compromises in known data breaches.
      </p>

      <InputField
        id="email-input"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
        icon={
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        }
      />

      <Button
        onClick={handleCheckBreach}
        disabled={loading}
        fullWidth
        className="mt-4"
        customBgClass="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Scanning...
          </span>
        ) : (
          'Check for Breaches'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {resultMessage && (
        <div className={`p-6 rounded-md mt-6 border-2 ${getStatusClasses(breachStatus)}`}>
          <h3 className="text-3xl font-bold mb-3 text-center text-white">{getStatusText(breachStatus)}</h3>
          <p className="text-lg text-center whitespace-pre-wrap text-white">{resultMessage}</p>
          <small className="block text-center mt-4 text-gray-300 opacity-75">
            Tip: Never reuse passwords across different services.
          </small>
        </div>
      )}
    </div>
  );
};