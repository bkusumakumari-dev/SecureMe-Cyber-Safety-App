
import React, { useState, useCallback } from 'react';
import { generateGeminiContent } from '../services/geminiService';
import { Button } from './Button';
import { InputField } from './InputField';
import { LoadingSpinner } from './LoadingSpinner';
import { ModuleFooter } from './ModuleFooter'; // Import ModuleFooter
import { Module } from '../types'; // Import Module type

interface PasswordHygieneAnalyzerProps {
  module: Module; // Accept module prop for ModuleFooter
}

export const PasswordHygieneAnalyzer: React.FC<PasswordHygieneAnalyzerProps> = ({ module }) => {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePasswordCharacteristics = useCallback(() => {
    const length = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
    return { length, hasUppercase, hasLowercase, hasNumbers, hasSymbols };
  }, [password]);

  const handleAnalyzePassword = useCallback(async () => {
    setError(null);
    setResult(null);
    if (!password) {
      setError('Please enter a dummy password to analyze.');
      return;
    }

    setLoading(true);
    try {
      const { length, hasUppercase, hasLowercase, hasNumbers, hasSymbols } = analyzePasswordCharacteristics();

      // IMPORTANT: We do NOT send the actual password to Gemini.
      // We send only its characteristics for AI-powered advice.
      const prompt = `Given a password with the following characteristics for an AI-powered analysis: length=${length}, uppercase=${hasUppercase ? 'yes' : 'no'}, lowercase=${hasLowercase ? 'yes' : 'no'}, numbers=${hasNumbers ? 'yes' : 'no'}, symbols=${hasSymbols ? 'yes' : 'no'}. Provide general advice on how to improve its strength and common weaknesses to avoid (e.g., minimum length, character diversity, avoiding personal info or common words). Do NOT try to guess the password or ask for the actual password. Emphasize that this is an AI-powered analysis of password characteristics, not the password itself.`;
      const response = await generateGeminiContent(prompt, { temperature: 0.6, maxOutputTokens: 200 });
      setResult(response);
    } catch (err) {
      setError(`Failed to analyze password hygiene. ${(err as Error).message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [password, analyzePasswordCharacteristics]);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-xl md:w-2/3 lg:w-1/2 mx-auto border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Password Hygiene Analyzer</h2>
      <p className="text-gray-300 mb-6">
        <strong>IMPORTANT: DO NOT ENTER YOUR REAL PASSWORD.</strong>
        Enter a dummy password with similar characteristics to get AI-powered advice on its strength.
        This tool analyzes password characteristics (length, character types) to provide general advice,
        and <strong className="text-red-400"> does not store or transmit your actual password.</strong>
      </p>

      <InputField
        id="dummy-password-input"
        label="Dummy Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter a dummy password here"
        required
        icon={
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2h2a2 2 0 012 2v5a2 2 0 01-2 2H3a2 2 0 01-2-2v-5a2 2 0 012-2h2zm8-2V7a3 3 0 00-6 0v2h6zm-2 4H7v2h6v-2z" clipRule="evenodd" />
          </svg>
        }
      />

      <Button
        onClick={handleAnalyzePassword}
        disabled={loading}
        fullWidth
        className="mt-4"
        customBgClass="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner /> Analyzing...
          </span>
        ) : (
          'Analyze Password'
        )}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-4">{error}</p>
      )}

      {result && (
        <div className="bg-gray-800 p-4 rounded-md mt-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis Result:</h3>
          <p className="text-gray-100 whitespace-pre-wrap">{result}</p>
          <p className="text-sm text-gray-300 mt-2 opacity-75">
            Always use unique, complex passwords and consider a password manager for robust security.
          </p>
        </div>
      )}

      {/* Module Footer */}
      <ModuleFooter module={module} />
    </div>
  );
};