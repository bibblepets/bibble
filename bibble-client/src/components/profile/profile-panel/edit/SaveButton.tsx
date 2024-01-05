import React from 'react';

interface SaveButtonProps {
  onSave: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onSave,
  isLoading,
  disabled
}) => {
  return (
    <button
      onClick={onSave}
      disabled={isLoading || disabled}
      className={`flex justify-center p-2 rounded-lg transition text-white text-sm font-semibold ${
        isLoading || disabled ? 'bg-gray-300' : 'bg-gray-800 hover:bg-gray-900'
      }`}
      style={{ width: '100px' }}
    >
      {isLoading ? (
        <div className="loader flex flex-row justify-center gap-1">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      ) : (
        'Save'
      )}
    </button>
  );
};

export default SaveButton;
