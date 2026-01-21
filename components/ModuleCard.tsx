
import React, { useState } from 'react';
import { Module } from '../types';
import { Button } from './Button';
import { HowToUseModal } from './HowToUseModal';

interface ModuleCardProps {
  module: Module;
  onNavigate: (id: string) => void;
  isActive: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onNavigate, isActive }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`relative rounded-lg shadow-md p-6 flex flex-col justify-between transition-all duration-300
        bg-white/10 backdrop-blur-md border border-gray-700
        ${isActive ? 'ring-2 ring-offset-2 ring-cyan-400 border-cyan-500' : 'hover:shadow-lg hover:border-cyan-600'}`}
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
        <p className="text-gray-300 text-sm mb-4">{module.description}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          onClick={() => onNavigate(module.id)}
          fullWidth
          className="sm:w-1/2"
          customBgClass="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500"
        >
          Access Module
        </Button>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="secondary"
          fullWidth
          className="sm:w-1/2"
        >
          How to Use
        </Button>
      </div>

      <HowToUseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`How to Use: ${module.name}`}
        content={module.howToUse}
      />
    </div>
  );
};