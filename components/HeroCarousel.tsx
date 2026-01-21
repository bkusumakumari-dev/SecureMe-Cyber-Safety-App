
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';
import { generateGeminiContent, Type } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface CarouselItem {
  image: string; // This will be constructed from imageKeywords
  title: string;
  description: string;
}

interface GeminiCarouselItem { // Intermediate type for Gemini response
  title: string;
  description: string;
  imageKeywords: string; // Still received from Gemini, but not used for image generation
}

// Static array of reliable images for the carousel background
// In a real application, these would be hosted assets or curated images.
const STATIC_CAROUSEL_IMAGES = [
  'https://picsum.photos/seed/cybersecurity1/960/540',
  'https://picsum.photos/seed/networksecurity/960/540',
  'https://picsum.photos/seed/datasecurity/960/540',
  'https://picsum.photos/seed/phishingawareness/960/540',
  'https://picsum.photos/seed/privacyprotection/960/540',
  'https://picsum.photos/seed/malwaredefense/960/540',
];

export const HeroCarousel: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarouselData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `Generate 5 distinct cyber awareness carousel items. Each item should be a JSON array of objects with 'title', 'description', and 'imageKeywords' fields. The 'imageKeywords' should be a short, comma-separated list of keywords suitable for an image search, relevant to the topic (e.g., "hacker, code, dark", "padlock, security, network", "phishing, email, scam"). Ensure diverse topics.`;

      const responseText = await generateGeminiContent(prompt, {
        temperature: 0.9,
        maxOutputTokens: 2000, // Increased token limit
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Compelling title for cyber awareness topic.' },
              description: { type: Type.STRING, description: 'Concise explanation of the topic.' },
              imageKeywords: { type: Type.STRING, description: 'Comma-separated keywords for image search.' },
            },
            propertyOrdering: ['title', 'description', 'imageKeywords'],
          },
        },
      });

      // Robust JSON parsing: Find the actual JSON array in the response text
      const jsonMatch = responseText.trim().match(/^\[[\s\S]*\]$/); // Matches content enclosed in []
      if (!jsonMatch) {
        throw new Error("Gemini response did not contain a valid JSON array structure. Received: " + responseText.substring(0, 200) + "...");
      }
      const jsonString = jsonMatch[0];

      const parsedResponse: GeminiCarouselItem[] = JSON.parse(jsonString);

      const mappedItems: CarouselItem[] = parsedResponse.map((item, index) => {
        // Use a static image from our predefined array, cycling through them
        const imageUrl = STATIC_CAROUSEL_IMAGES[index % STATIC_CAROUSEL_IMAGES.length];
        
        return {
          title: item.title,
          description: item.description,
          image: imageUrl,
        };
      });

      setCarouselItems(mappedItems);
    } catch (err) {
      console.error("Failed to fetch carousel data from Gemini:", err);
      setError(`Failed to load cyber awareness content: ${(err as Error).message}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarouselData();
  }, [fetchCarouselData]);

  useEffect(() => {
    if (carouselItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
      }, 10000); // Change slide every 10 seconds

      return () => clearInterval(interval);
    }
  }, [carouselItems]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80 md:h-96 bg-gray-800 rounded-lg shadow-xl mb-10 border border-gray-700">
        <LoadingSpinner />
        <p className="ml-4 text-gray-300">Generating live cyber awareness insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 md:h-96 bg-red-900/40 text-red-100 rounded-lg shadow-xl mb-10 border border-red-700 p-4 text-center">
        <p className="font-bold text-lg mb-2">Error:</p>
        <p className="mb-4">{error}</p>
        <Button onClick={fetchCarouselData} className="mt-4" customBgClass="bg-red-600 hover:bg-red-700 focus:ring-red-500">
          Retry
        </Button>
      </div>
    );
  }

  if (carouselItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 md:h-96 bg-gray-800 text-gray-300 rounded-lg shadow-xl mb-10 border border-gray-700">
        <p>No cyber awareness content available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg shadow-xl mb-10 bg-gray-800 border border-gray-700">
      {carouselItems.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-end p-8 bg-cover bg-center ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${item.image})` }}
          role="img"
          aria-label={item.title}
        >
          <div className="text-white z-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-2 text-cyan-400 drop-shadow-lg">{item.title}</h2>
            <p className="text-lg text-gray-200 drop-shadow">{item.description}</p>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      <Button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-cyan-400' : 'bg-gray-400 opacity-70'
            } transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
