
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

const INCIDENT_TYPES = [
  'Hacked Email Account',
  'Malware Infection',
  'Phishing Attack',
  'Ransomware Attack',
  'Data Leak / Identity Theft',
  'Lost or Stolen Device',
];

interface IncidentResponseGuideProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const IncidentResponseGuide: React.FC<IncidentResponseGuideProps> = ({ module }) => {
  const [selectedIncident, setSelectedIncident] = useState<string>('');
  const [guide, setGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetGuide = useCallback(async () => {
    setError(null);
    setGuide(null);
    if (!selectedIncident) {
      setError('Please select an incident type.');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Provide a detailed, step-by-step AI-powered guide on how to respond to a cyber incident, specifically "${selectedIncident}". Focus on immediate actions, containment, evidence collection, notification (if applicable), recovery, and prevention. Present it as a comprehensive guide with clear headings and numbered steps.
      IMPORTANT: Do not suggest visiting external websites or contacting external services. All advice should be actionable by the user directly within the context of general cybersecurity best practices, as if this app is their sole source of immediate guidance.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 600 });
      setGuide(response);
    } catch (err) {
      setError(`Failed to load incident response guide. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedIncident]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl max-w-3xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Incident Response Guide</h2>
      <p className="text-gray-300 mb-6">
        Get AI-powered, step-by-step instructions for handling common cyber incidents.
      </p>

      <div className="mb-4">
        <label htmlFor="incident-select" className="block text-gray-200 text-sm font-bold mb-2">
          Select Incident Type:
        </label>
        <select
          id="incident-select"
          value={selectedIncident}
          onChange={(e) => setSelectedIncident(e.target.value)}
          className="shadow border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        >
          <option value="">-- Choose an incident --</option>
          {INCIDENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleGetGuide}
        disabled={loading || !selectedIncident}
        fullWidth
        className="mt-4"
        customBgClass="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Generating Guide...
          </span>
        ) : (
          'Generate Guide'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {guide && (
        <div className="bg-gray-800 p-4 rounded-md mt-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-2">Response Guide for {selectedIncident}:</h3>
          <p className="text-gray-100 whitespace-pre-wrap">{guide}</p>
        </div>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};