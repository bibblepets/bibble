import { XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';

interface BaseModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const BaseModal: React.FC<BaseModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-25 backdrop-filter backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-lg">
        <div className="relative my-4">{children}</div>
        <button
          className="absolute top-5 right-8 text-gray-500 rounded-full bg-gray-100 bg-opacity-75 p-2 transition hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default BaseModal;
