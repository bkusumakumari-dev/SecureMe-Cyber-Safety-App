
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { InputField } from './InputField';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

type PhoneNumberStatus = 'safe' | 'unsafe' | 'warning' | null;

interface PhoneNumberAnalyzerProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const PhoneNumberAnalyzer: React.FC<PhoneNumberAnalyzerProps> = ({ module }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [phoneStatus, setPhoneStatus] = useState<PhoneNumberStatus>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineStatus = (text: string): PhoneNumberStatus => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('appears safe') || lowerText.includes('no spam indicators') || lowerText.includes('valid & safe')) {
      return 'safe';
    }
    if (lowerText.includes('potential spam') || lowerText.includes('spam indicators') || lowerText.includes('dangerous') || lowerText.includes('suspicious')) {
      return 'unsafe';
    }
    if (lowerText.includes('invalid format')) {
      return 'warning';
    }
    return 'warning'; // Default to warning if unclear
  };

  const getStatusClasses = (status: PhoneNumberStatus) => {
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

  const getStatusText = (status: PhoneNumberStatus) => {
    switch (status) {
      case 'safe': return 'NUMBER APPEARS SAFE!';
      case 'unsafe': return 'WARNING: POTENTIAL THREAT!';
      case 'warning': return 'INVALID OR UNCERTAIN!';
      default: return 'Analysis Result';
    }
  };

  const handleAnalyzePhoneNumber = useCallback(async () => {
    setError(null);
    setResultMessage(null);
    setPhoneStatus(null);
    if (!phoneNumber) {
      setError('Please enter a phone number to analyze.');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Perform an AI-powered analysis of the phone number "${phoneNumber}" for common characteristics.
      1. Is it a valid phone number format?
      2. Does it show indicators of spam activity (e.g., frequently reported, unusual call patterns)?
      3. Can it be associated with a business (e.g., commonly used for customer service, sales)? If so, provide a general, hypothetical industry type (e.g., 'telemarketing', 'delivery service', 'retail'). Do NOT attempt to provide any individual's name or private personal information.
      4. Provide a conclusive status at the beginning (e.g., 'Valid & Appears Safe', 'Valid & Potential Spam', 'Invalid Format'). Then, give a brief explanation of findings.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 250 });
      setResultMessage(response);
      setPhoneStatus(determineStatus(response));
    } catch (err) {
      setError(`Failed to analyze phone number. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl md:w-2/3 lg:w-1/2 mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Phone Number Analyzer</h2>
      <p className="text-gray-300 mb-6">
        Enter a phone number to get an AI-powered analysis for validity, potential spam, and public associations.
        <strong className="text-red-400"> This tool does not provide private personal information.</strong>
      </p>

      <InputField
        id="phone-number-input"
        label="Phone Number"
        type="tel" // Use tel for phone numbers
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+1 (555) 123-4567 or 555-123-4567"
        required
        icon={
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 1.968a1 1 0 01-.108.96l-1.54 1.54a.675.675 0 00-.09.705l.543.543c.253.253.332.56.287.962-.482 3.864 1.638 7.377 4.501 10.24a11.51 11.51 0 005.474 2.378.674.674 0 00.705-.09l1.54-1.54a1 1 0 01.96-.108l1.968.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1a17.027 17.027 0 01-14-14H2z" />
          </svg>
        }
      />

      <Button
        onClick={handleAnalyzePhoneNumber}
        disabled={loading}
        fullWidth
        className="mt-4"
        customBgClass="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Analyzing...
          </span>
        ) : (
          'Analyze Number'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {resultMessage && (
        <div className={`p-6 rounded-md mt-6 border-2 ${getStatusClasses(phoneStatus)}`}>
          <h3 className="text-3xl font-bold mb-3 text-center text-white">{getStatusText(phoneStatus)}</h3>
          <p className="text-lg text-center whitespace-pre-wrap text-white">{resultMessage}</p>
        </div>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};