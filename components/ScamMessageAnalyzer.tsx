
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

type MessageStatus = 'safe' | 'unsafe' | 'warning' | null;

interface ScamMessageAnalyzerProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const ScamMessageAnalyzer: React.FC<ScamMessageAnalyzerProps> = ({ module }) => {
  const [message, setMessage] = useState('');
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [messageStatus, setMessageStatus] = useState<MessageStatus>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineStatus = (text: string): MessageStatus => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('not suspicious') || lowerText.includes('potentially harmless') || lowerText.includes('appears safe')) {
      return 'safe';
    }
    if (lowerText.includes('highly suspicious') || lowerText.includes('scam indicators') || lowerText.includes('phishing attempt') || lowerText.includes('dangerous')) {
      return 'unsafe';
    }
    return 'warning';
  };

  const getStatusClasses = (status: MessageStatus) => {
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

  const getStatusText = (status: MessageStatus) => {
    switch (status) {
      case 'safe': return 'MESSAGE APPEARS SAFE!';
      case 'unsafe': return 'WARNING: SUSPICIOUS MESSAGE!';
      case 'warning': return 'CAUTION: REVIEW MESSAGE CAREFULLY!';
      default: return 'Result';
    }
  };

  const handleAnalyzeMessage = useCallback(async () => {
    setError(null);
    setResultMessage(null);
    setMessageStatus(null);
    if (!message) {
      setError('Please paste a message to analyze.');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Perform an AI-powered analysis of the following message for characteristics of a scam or phishing attempt. Identify any red flags such as urgent requests, suspicious links, emotional manipulation, unusual sender details, or grammatical errors. Provide a clear recommendation first (e.g., "Highly Suspicious", "Potentially Harmless", "Uncertain, proceed with caution"), then a summary of your findings. Message: "${message}"`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 250 });
      setResultMessage(response);
      setMessageStatus(determineStatus(response));
    } catch (err) {
      setError(`Failed to analyze message. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [message]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl md:w-2/3 lg:w-1/2 mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Scam Message Analyzer</h2>
      <p className="text-gray-300 mb-6">
        Paste any suspicious message (email content, SMS, chat message) below to get an AI-powered analysis for scam indicators.
      </p>

      <TextArea
        id="message-input"
        label="Suspicious Message Content"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="e.g., 'You have won a lottery! Click here to claim your prize...'"
        rows={8}
        required
      />

      <Button
        onClick={handleAnalyzeMessage}
        disabled={loading}
        fullWidth
        className="mt-4"
        customBgClass="bg-violet-600 hover:bg-violet-700 focus:ring-violet-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Analyzing...
          </span>
        ) : (
          'Analyze Message'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {resultMessage && (
        <div className={`p-6 rounded-md mt-6 border-2 ${getStatusClasses(messageStatus)}`}>
          <h3 className="text-3xl font-bold mb-3 text-center text-white">{getStatusText(messageStatus)}</h3>
          <p className="text-lg text-center whitespace-pre-wrap text-white">{resultMessage}</p>
          <p className="text-sm mt-4 text-center text-gray-300 opacity-75">
            If a message is flagged as suspicious, do not engage with it.
          </p>
        </div>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};