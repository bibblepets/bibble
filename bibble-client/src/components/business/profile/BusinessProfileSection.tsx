import { PencilIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

type BusinessProfileSectionProps = {
  title?: string;
  children: React.ReactNode;
  editComponent?: React.FC;
};

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({
  title,
  children,
  editComponent: EditComponent
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="flex flex-col gap-8 w-full p-8">
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">{title}</h2>
        {EditComponent &&
          (!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full text-gray-400 transition hover:scale-105 hover:text-gray-500"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="border rounded-lg px-4 py-1 transition text-gray-400 hover:text-gray-500 hover:border-gray-400"
            >
              <label className="text-sm cursor-pointer">Done</label>
            </button>
          ))}
      </div>
      {EditComponent && isEditing ? <EditComponent /> : children}
    </section>
  );
};

export default BusinessProfileSection;
