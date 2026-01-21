
import React, { useState, useEffect, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './Button';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

interface AwarenessTopic {
  id: string;
  title: string;
  prompt: string;
}

const AWARENESS_TOPICS: AwarenessTopic[] = [
  {
    id: 'malware-risk',
    title: 'Malware Risk Awareness',
    prompt: `Explain what malware is, common types (e.g., viruses, worms, ransomware, spyware), how it spreads, and effective prevention tips. Present it as an informative article with clear sections.`,
  },
  {
    id: 'digital-footprint',
    title: 'Digital Footprint & Metadata Checker Awareness',
    prompt: `Describe what a digital footprint is, why it matters for privacy and security, and practical tips on how to manage and reduce your online presence effectively. Also, briefly explain what metadata is in the context of digital files and communications.`,
  },
  {
    id: 'dark-web-exposure',
    title: 'Dark Web Exposure Awareness',
    prompt: `Provide an overview of the dark web in simple terms, how personal data might end up there (e.g., data breaches), and general advice on what to do if you suspect your information has been exposed. Focus on awareness and mitigation, not access.`,
  },
  {
    id: 'attack-pattern-recognition',
    title: 'Attack Pattern Recognition',
    prompt: `Explain common cyber attack patterns and recognition strategies for a non-technical user. Cover concepts like social engineering (phishing, pretexting, baiting), brute-force attacks, denial-of-service, and common indicators to look out for.`,
  },
];

interface CyberAwarenessHubProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const CyberAwarenessHub: React.FC<CyberAwarenessHubProps> = ({ module }) => {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(AWARENESS_TOPICS[0]?.id || null);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopicContent = useCallback(async (topic: AwarenessTopic) => {
    if (contentMap[topic.id]) {
      // Content already loaded
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await generateGeminiContent(topic.prompt, { temperature: 0.6, maxOutputTokens: 700 });
      setContentMap((prev) => ({ ...prev, [topic.id]: response }));
    } catch (err) {
      setError(`Failed to load content for ${topic.title}. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [contentMap]);

  useEffect(() => {
    if (activeTopicId) {
      const topic = AWARENESS_TOPICS.find(t => t.id === activeTopicId);
      if (topic) {
        fetchTopicContent(topic);
      }
    }
  }, [activeTopicId, fetchTopicContent]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl max-w-4xl mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Cyber Awareness Hub</h2>
      <p className="text-gray-300 mb-6">
        Expand your knowledge of cybersecurity with AI-powered educational resources on various threats and best practices.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <nav className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
            <h3 className="font-bold text-white mb-3">Topics</h3>
            <ul>
              {AWARENESS_TOPICS.map((topic) => (
                <li key={topic.id} className="mb-2">
                  <Button
                    onClick={() => setActiveTopicId(topic.id)}
                    variant="secondary"
                    className={`block w-full text-left py-2 px-3 rounded-md transition-colors duration-200
                      ${activeTopicId === topic.id
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'text-gray-200 hover:bg-gray-700'
                      }`}
                  >
                    {topic.title}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Content Display */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 min-h-[400px] flex flex-col justify-center items-center">
            {error && <p className="text-red-400 text-center">{error}</p>}
            {loading && <LoadingSpinner />}
            {!loading && !error && activeTopicId && contentMap[activeTopicId] && (
              <div className="w-full text-gray-100 whitespace-pre-wrap">
                <h3 className="text-xl font-bold text-white mb-4">
                  {AWARENESS_TOPICS.find(t => t.id === activeTopicId)?.title}
                </h3>
                <p>{contentMap[activeTopicId]}</p>
              </div>
            )}
            {!loading && !error && !activeTopicId && (
              <p className="text-gray-400">Select a topic from the left to learn more.</p>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-6 text-center opacity-75">
        Stay informed, stay safe! Regular education is key to preventing cyber threats.
      </p>

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};