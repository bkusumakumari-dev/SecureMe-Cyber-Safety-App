
import React, { useState, useEffect, useCallback } from 'react';

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute transition-all duration-1000 ease-out ${className} ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
      {children}
    </div>
  );
};

// Keyframe animations for TailwindCSS (can be added to a global CSS file or via custom config)
const tailwindAnimations = `
  @keyframes float-subtle {
    0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
    25% { transform: translateY(-5px) translateX(5px) rotate(1deg); }
    50% { transform: translateY(0px) translateX(-5px) rotate(-1deg); }
    75% { transform: translateY(5px) translateX(5px) rotate(0.5deg); }
  }
  @keyframes pulse-ring {
    0% {
      transform: scale(0.3);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-float-subtle {
    animation: float-subtle 10s ease-in-out infinite;
  }
  .animate-pulse-ring {
    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .animate-rotate-slow {
    animation: rotate-slow 60s linear infinite;
  }
`;

const CYBER_STATS = [
  "90% of cyber attacks start with phishing.",
  "Human error accounts for 85% of data breaches.",
  "Ransomware attacks increased by 150% last year.",
  "Cybercrime costs are projected to reach $10.5 trillion annually by 2025.",
  "Data breaches expose over 30 billion records each year.",
];

export const CyberHero: React.FC = () => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  useEffect(() => {
    // Inject custom CSS animations if not already present
    if (!document.getElementById('tailwind-animations-style')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'tailwind-animations-style';
      styleTag.innerHTML = tailwindAnimations;
      document.head.appendChild(styleTag);
    }

    const statTimer = setInterval(() => {
      setCurrentStatIndex((prevIndex) => (prevIndex + 1) % CYBER_STATS.length);
    }, 8000); // Change stat every 8 seconds

    return () => {
      clearInterval(statTimer);
    };
  }, []);


  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-gray-100 overflow-hidden rounded-lg">
      {/* Background Pulsing World Map */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg
          className="w-full h-full max-w-3xl animate-rotate-slow"
          viewBox="0 0 1000 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M999 250c0 137.95-111.96 249.91-249.91 249.91C611.14 499.91 500 388.8 500 250S611.14 0.09 749.09 0.09C887.04 0.09 999 112.05 999 250z"
            fill="url(#paint0_linear_140_2)"
          />
          <path
            d="M500 250c0 137.95-111.96 249.91-249.91 249.91C111.05 499.91 0 388.8 0 250S111.05 0.09 250.09 0.09C388.04 0.09 500 112.05 500 250z"
            fill="url(#paint1_linear_140_2)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_140_2"
              x1="500"
              y1="0.0900002"
              x2="999"
              y2="499.91"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6EE7B7" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_140_2"
              x1="0"
              y1="0.0900002"
              x2="500"
              y2="499.91"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6EE7B7" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Add some pulsing nodes */}
          <circle cx="200" cy="150" r="10" fill="#06B6D4" className="animate-pulse-ring" />
          <circle cx="700" cy="350" r="10" fill="#06B6D4" className="animate-pulse-ring" style={{ animationDelay: '1s' }} />
          <circle cx="500" cy="250" r="10" fill="#06B6D4" className="animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        </svg>
      </div>


      <h2 className="relative text-3xl font-bold text-white mb-6 text-center z-20">
        Cyber Threat Intelligence
      </h2>

      {/* Floating Animated Icons */}
      <AnimatedElement className="top-10 left-1/4 w-16 h-16 animate-float-subtle" delay={100}>
        <svg className="w-full h-full text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z" />
        </svg> {/* Shield icon */}
      </AnimatedElement>

      <AnimatedElement className="bottom-20 right-1/4 w-12 h-12 animate-float-subtle" delay={300}>
        <svg className="w-full h-full text-green-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
        </svg> {/* Lock icon */}
      </AnimatedElement>

      <AnimatedElement className="top-1/3 left-10 w-14 h-14 animate-float-subtle" delay={500}>
        <svg className="w-full h-full text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 6.92V16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6.92c0-.62.33-1.19.86-1.5l8-4c.48-.24 1.04-.24 1.52 0l8 4c.53.31.86.88.86 1.5zm-10-2.58l-6 3V16h12V7.34l-6-3.01z" />
        </svg> {/* Warning icon - stylized email envelope */}
      </AnimatedElement>


      {/* Live Statistics Display */}
      <div className="relative z-20 bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center mt-10 w-4/5 mx-auto border border-cyan-700 shadow-lg">
        <p className="text-xl font-semibold text-cyan-400">
          LIVE DATA:
        </p>
        <p className="text-lg mt-2 text-white transition-opacity duration-700 ease-in-out">
          {CYBER_STATS[currentStatIndex]}
        </p>
      </div>

    </div>
  );
};
