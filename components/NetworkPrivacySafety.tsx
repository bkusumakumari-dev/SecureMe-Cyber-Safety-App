
import React, { useState, useCallback, useEffect } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

interface NetworkPrivacySafetyProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const NetworkPrivacySafety: React.FC<NetworkPrivacySafetyProps> = ({ module }) => {
  const [activeTab, setActiveTab] = useState<'network' | 'privacy'>('network');
  const [networkGuide, setNetworkGuide] = useState<string | null>(null);
  const [privacyGuide, setPrivacyGuide] = useState<string | null>(null);
  const [loadingNetwork, setLoadingNetwork] = useState(false);
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNetworkSafetyGuide = useCallback(async () => {
    setLoadingNetwork(true);
    setError(null);
    try {
      const prompt = `Provide a detailed AI-powered guide on staying safe on public Wi-Fi networks and securing home networks. Include best practices, common risks (e.g., sniffing, rogue access points), and recommended actions (e.g., VPN usage, strong router passwords, firewall). Present it as a comprehensive guide with clear headings and bullet points.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 500 });
      setNetworkGuide(response);
    } catch (err) {
      setError(`Failed to load network safety guide. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoadingNetwork(false);
    }
  }, []);

  const getPrivacySafetyGuide = useCallback(async () => {
    setLoadingPrivacy(true);
    setError(null);
    try {
      const prompt = `Offer a comprehensive AI-powered checklist and advice for managing device privacy settings and permissions on smartphones and computers. Cover topics like app permissions (camera, microphone, location), browser privacy settings, cookie management, data sharing, and security updates. Present it as a clear guide with actionable steps and bullet points.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.7, maxOutputTokens: 500 });
      setPrivacyGuide(response);
    } catch (err) {
      setError(`Failed to load device privacy guide. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoadingPrivacy(false);
    }
  }, []);

  // Fetch guides on component mount
  useEffect(() => {
    getNetworkSafetyGuide();
    getPrivacySafetyGuide();
  }, [getNetworkSafetyGuide, getPrivacySafetyGuide]);

  const renderContent = () => {
    if (error) {
      return <p className="text-red-400 text-center mt-4">{error}</p>;
    }

    if (activeTab === 'network') {
      if (loadingNetwork) return <LoadingSpinner />;
      if (networkGuide) {
        return (
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2">Network & Wi-Fi Safety Guide</h3>
            <p className="text-gray-100 whitespace-pre-wrap">{networkGuide}</p>
          </div>
        );
      }
      return null;
    } else {
      if (loadingPrivacy) return <LoadingSpinner />;
      if (privacyGuide) {
        return (
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-2">Device Privacy & Permission Guide</h3>
            <p className="text-gray-100 whitespace-pre-wrap">{privacyGuide}</p>
          </div>
        );
      }
      return null;
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl max-w-3xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Network & Privacy Safety</h2>
      <p className="text-gray-300 mb-6">
        Access AI-powered guides and checklists to enhance your network security and manage device privacy settings.
      </p>

      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 text-center text-lg font-medium ${
            activeTab === 'network'
              ? 'border-b-2 border-purple-400 text-purple-400'
              : 'text-gray-400 hover:text-gray-200'
          } focus:outline-none`}
          onClick={() => setActiveTab('network')}
        >
          Network & Wi-Fi Safety
        </button>
        <button
          className={`py-2 px-4 text-center text-lg font-medium ${
            activeTab === 'privacy'
              ? 'border-b-2 border-purple-400 text-purple-400'
              : 'text-gray-400 hover:text-gray-200'
          } focus:outline-none`}
          onClick={() => setActiveTab('privacy')}
        >
          Device Privacy
        </button>
      </div>

      {renderContent()}

      <p className="text-sm text-gray-400 mt-6 opacity-75">
        Applying these guidelines diligently empowers you to strengthen your digital defenses.
      </p>

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};