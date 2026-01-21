
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { APP_NAME, MODULES } from './constants';
import { ModuleCard } from './components/ModuleCard';
import { Button } from './components/Button';
import { HowToUseModal } from './components/HowToUseModal';
import { CyberSecurityContext } from './components/CyberSecurityContext';
import { UserRiskProfile, RiskLevel } from './types';
import { CyberHero } from './components/CyberHero';
import { HeroCarousel } from './components/HeroCarousel'; // Changed import from HomeAwarenessCarousel to HeroCarousel

// Helper function to map numerical value to risk level
const valueToRiskLevel = (value: number): RiskLevel => {
  if (value <= 20) return 'Critical';
  if (value <= 40) return 'High';
  if (value <= 70) return 'Medium';
  return 'Low';
};

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

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHomeHowToUseOpen, setIsHomeHowToUseOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserRiskProfile>({
    breachExposure: 'Medium',
    phishingVulnerability: 'Medium',
    passwordStrength: 'Medium',
    networkSecurity: 'Medium',
    devicePrivacy: 'Medium',
    overallScore: 50,
  });

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


  // Set initial active module based on hash or default
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash === 'home' || (hash && MODULES.some(m => m.id === hash))) {
      setActiveModuleId(hash);
    } else if (MODULES.length > 0) {
      setActiveModuleId('home'); // Default to home view
      window.location.hash = 'home';
    }
  }, []);

  // Update activeModuleId when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'home' || (hash && MODULES.some(m => m.id === hash))) {
        setActiveModuleId(hash);
      } else if (!activeModuleId) {
        // Fallback if hash is invalid or missing, and no module is active
        setActiveModuleId('home');
        window.location.hash = 'home';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeModuleId]);

  // Dynamically change body background class based on active module
  useLayoutEffect(() => {
    // No need to change body class dynamically based on module for this dark theme.
    // The main body background is set once in index.html to bg-slate-950.
    // Module components will manage their internal backgrounds.
  }, [activeModuleId]);


  const handleNavigateToModule = (id: string) => {
    setActiveModuleId(id);
    window.location.hash = id;
    setIsSidebarOpen(false); // Close sidebar on navigation
  };

  const currentModule = MODULES.find(module => module.id === activeModuleId);

  // Adjusted for dark theme modal content
  const homeHowToUseContent = `
    <h3 class="text-lg font-bold mb-2 text-white">Welcome to Secure Me - Cyber Safety App!</h3>
    <p class="mb-4 text-gray-300">This application is designed to help you understand and improve your personal cyber safety posture through various interactive modules. Think of it as your personal guide to a safer digital life.</p>
    <h4 class="font-semibold text-md mb-2 text-white">How to Navigate:</h4>
    <ol class="list-decimal list-inside space-y-2 mb-4 text-gray-300">
      <li><strong>Universal Access Button:</strong> Look for the menu icon (hamburger) at the top-left corner. Click it to open the navigation sidebar from any page.</li>
      <li><strong>Sidebar/Module List:</strong> The sliding sidebar contains "Home" and a list of all available modules. Click on any item to navigate.</li>
      <li><strong>Module Cards (Home):</strong> From the homepage, you can click "Access Module" on any card to go directly to that module.</li>
      <li><strong>"How to Use" Buttons:</strong> Each module, including the home screen, has a dedicated "How to Use" button. Click it to get detailed instructions on how to use that specific feature.</li>
    </ol>
    <h4 class="font-semibold text-md mb-2 text-white">Key Features:</h4>
    <ul class="list-disc list-inside space-y-2 mb-4 text-gray-300">
      <li><strong>AI-Powered Tools:</strong> Engage with AI-driven tools like the Account Breach Checker or Scam Message Analyzer.</li>
      <li><strong>AI-Generated Educational Content:</strong> Learn about various cyber threats and best practices in the Cyber Awareness Hub.</li>
      <li><strong>Risk Assessment:</strong> Monitor your cyber risk score on the Dashboard.</li>
    </ul>
    <p class="text-red-400 font-bold mt-4">For comprehensive real-time security, regularly apply the advice provided and maintain diligent digital hygiene.</p>
  `;

  return (
    <CyberSecurityContext.Provider value={{ userProfile, setUserProfile }}>
      <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100">
        {/* Header and Universal Menu Button */}
        <header className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 shadow-lg flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            <Button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-purple-700 hover:bg-purple-600 rounded-md mr-2" // Removed md:hidden, now always visible
              aria-label="Toggle navigation"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <a href="#home" className="text-xl font-bold flex items-center">
              <img src="https://picsum.photos/40/40?random=logo" alt="Logo" className="h-8 w-8 rounded-full mr-2 border-2 border-cyan-400" />
              {APP_NAME}
            </a>
          </div>
          {/* How to Use App button only visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4">
            <Button onClick={() => setIsHomeHowToUseOpen(true)} variant="secondary" className="bg-purple-700 hover:bg-purple-600 text-white">
              How to Use App
            </Button>
          </div>
          {/* Mobile How to Use App button (now only used on mobile) */}
          <div className="md:hidden">
            <Button onClick={() => setIsHomeHowToUseOpen(true)} className="p-2 bg-purple-700 hover:bg-purple-600 rounded-md" aria-label="How to use app">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
          </div>
        </header>

        {/* Main Content Area - Split Screen Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar for Navigation (universal) */}
          <aside
            className={`fixed inset-y-0 left-0 bg-gray-900 text-white w-64 p-4 z-50 transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">{APP_NAME}</span>
              <Button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            <nav className="space-y-2">
              <Button
                onClick={() => handleNavigateToModule('home')}
                className={`w-full text-left py-2 px-3 rounded-md transition-colors duration-200
                  ${activeModuleId === 'home' ? 'bg-purple-600 text-white' : 'text-gray-200 hover:bg-gray-700'}`}
                variant="secondary"
              >
                Home
              </Button>
              {MODULES.map((module) => (
                <Button
                  key={module.id}
                  onClick={() => handleNavigateToModule(module.id)}
                  className={`w-full text-left py-2 px-3 rounded-md transition-colors duration-200
                    ${activeModuleId === module.id ? 'bg-purple-600 text-white' : 'text-gray-200 hover:bg-gray-700'}`}
                  variant="secondary"
                >
                  {module.name}
                </Button>
              ))}
            </nav>
          </aside>

          {/* Overlay for sidebar */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            ></div>
          )}

          {/* Dual Pane Layout for larger screens */}
          <div className="flex flex-1">
            {/* Left Section - Engagement Area (CyberHero) - Visible on md and up */}
            <aside className="hidden md:flex w-1/3 min-h-full bg-gradient-to-br from-slate-900 to-indigo-950 p-6 shadow-xl relative z-10 flex-col justify-center items-center">
              <CyberHero />
            </aside>

            {/* Right Section - Main Content / Modules */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-900 z-0">
              {activeModuleId === 'home' || !currentModule ? (
                <div className="flex-1 container mx-auto py-8">
                  {/* Home Awareness Carousel */}
                  <HeroCarousel />
                  <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
                    Welcome to <span className="text-cyan-400">{APP_NAME}</span>
                  </h1>
                  <p className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto">
                    Your personal guide to understanding and enhancing your digital security.
                    Explore our modules to become more cyber-aware!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        onNavigate={handleNavigateToModule}
                        isActive={activeModuleId === module.id}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 py-8">
                  {currentModule && <currentModule.component module={currentModule} />}
                </div>
              )}
            </main>
          </div>
        </div>

        <HowToUseModal
          isOpen={isHomeHowToUseOpen}
          onClose={() => setIsHomeHowToUseOpen(false)}
          title={`How to Use: ${APP_NAME}`}
          content={homeHowToUseContent}
        />
      </div>
    </CyberSecurityContext.Provider>
  );
};

export default App;
