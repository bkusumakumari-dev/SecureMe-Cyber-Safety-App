
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-cyan-700">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <Button variant="secondary" onClick={onClose} aria-label="Close" className="p-2 -mr-2 bg-gray-700 hover:bg-gray-600 text-gray-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div className="p-6 text-gray-100"> {/* Default text color for modal content */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <Button onClick={onClose} variant="primary" customBgClass="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500">
            Got It!
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};