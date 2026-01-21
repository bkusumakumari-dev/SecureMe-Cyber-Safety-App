
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { InputField } from './InputField';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

type UrlStatus = 'safe' | 'unsafe' | 'warning' | null;

interface ScamPhishingGuardProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const ScamPhishingGuard: React.FC<ScamPhishingGuardProps> = ({ module }) => {
  const [url, setUrl] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [urlStatus, setUrlStatus] = useState<UrlStatus>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineStatus = (text: string): UrlStatus => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('safe') && !lowerText.includes('suspicious') && !lowerText.includes('dangerous') && !lowerText.includes('malicious')) {
      return 'safe';
    }
    if (lowerText.includes('suspicious') || lowerText.includes('dangerous') || lowerText.includes('malicious')) {
      return 'unsafe';
    }
    return 'warning';
  };

  const getStatusClasses = (status: UrlStatus) => {
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

  const getStatusText = (status: UrlStatus) => {
    switch (status) {
      case 'safe': return 'URL IS SAFE!';
      case 'unsafe': return 'WARNING: POTENTIALLY DANGEROUS URL!';
      case 'warning': return 'CAUTION: URL REQUIRES ATTENTION!';
      default: return 'Result';
    }
  };

  const handleAnalyzeUrl = useCallback(async () => {
    setError(null);
    setResultMessage(null);
    setUrlStatus(null);
    if (!url) {
      setError('Please enter a URL to analyze.');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Perform an AI-powered analysis of the following URL for potential scam or phishing indicators: "${url}". Provide a safety rating first (e.g., "Safe", "Suspicious", or "Dangerous"), then explain why, focusing on common red flags (e.g., typos, unusual domains, urgent language). Example unsafe response: "Dangerous. This URL has typos and redirects to a suspicious domain known for phishing. Avoid clicking." Example safe response: "Safe. This URL appears legitimate and matches expected patterns."`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 200 });
      setResultMessage(response);
      setUrlStatus(determineStatus(response));
    } catch (err) {
      setError(`Failed to analyze URL. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl md:w-2/3 lg:w-1/2 mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Scam & Phishing Guard (URL Safety)</h2>
      <p className="text-gray-300 mb-6">
        Paste a suspicious URL or link below to get an AI-powered analysis for potential scam or phishing threats.
      </p>

      <InputField
        id="url-input"
        label="URL or Link"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://suspicious-link.com/login"
        required
        icon={
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0L11.414 13a2 2 0 01-2.828 2.828l-3-3a2 2 0 010-2.828 1 1 0 00-1.414-1.414 4 4 0 000 5.656l3 3a4 4 0 005.656 0l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 01-2.828 0z" clipRule="evenodd" />
          </svg>
        }
      />

      <Button
        onClick={handleAnalyzeUrl}
        disabled={loading}
        fullWidth
        className="mt-4"
        customBgClass="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Analyzing...
          </span>
        ) : (
          'Analyze URL'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {resultMessage && (
        <div className={`p-6 rounded-md mt-6 border-2 ${getStatusClasses(urlStatus)}`}>
          <h3 className="text-3xl font-bold mb-3 text-center text-white">{getStatusText(urlStatus)}</h3>
          <p className="text-lg text-center whitespace-pre-wrap text-white">{resultMessage}</p>
          <p className="text-sm mt-4 text-center text-gray-300 opacity-75">
            Always be cautious with links, especially from unknown senders.
          </p>
        </div>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};