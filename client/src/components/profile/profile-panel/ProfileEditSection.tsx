import React, { useCallback, useState } from 'react';

interface ProfileEditSectionProps {
  label: string;
  value?: string | boolean;
  editDescription: string;
  editComponent: React.FC;
}

const ProfileEditSection: React.FC<ProfileEditSectionProps> = ({
  label,
  value,
  editDescription,
  editComponent: EditComponent
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-gray-800">{label}</label>
          <p className="text-sm font-light text-gray-500">
            {isEditing
              ? editDescription
              : value === true
                ? 'Provided'
                : value || 'Not provided'}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="text-sm font-medium underline text-gray-800"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing && <EditComponent />}
      <hr />
    </div>
  );
};

export default ProfileEditSection;
