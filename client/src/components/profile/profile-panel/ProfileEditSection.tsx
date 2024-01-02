import React, { useCallback, useState } from 'react';

interface ProfileEditSectionProps {
  label: string;
  value?: string | boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  editDescription: string;
  editComponent: React.FC;
}

const ProfileEditSection: React.FC<ProfileEditSectionProps> = ({
  label,
  value,
  editValue,
  setEditValue,
  editDescription,
  editComponent: EditComponent
}) => {
  const isEditingThis = editValue === label;
  const isEditingOther = editValue !== '' && !isEditingThis;

  const onEdit = useCallback(() => {
    if (isEditingThis) {
      setEditValue('');
    } else {
      setEditValue(label);
    }
  }, [isEditingThis]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <label className={isEditingOther ? 'text-gray-200' : 'text-gray-800'}>
            {label}
          </label>
          <p
            className={`text-sm font-light ${
              isEditingOther ? 'text-gray-200' : 'text-gray-500'
            }`}
          >
            {isEditingThis
              ? editDescription
              : value === true
                ? 'Provided'
                : value || 'Not provided'}
          </p>
        </div>
        <button
          onClick={onEdit}
          disabled={isEditingOther}
          className={`text-sm font-medium underline ${
            isEditingOther ? 'text-gray-200' : 'text-gray-800'
          }`}
        >
          {isEditingThis ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditingThis && <EditComponent />}
      <hr />
    </div>
  );
};

export default ProfileEditSection;
