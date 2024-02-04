import React from 'react';

export type BusinessProfileComponentProps = {
  setIsEditing: (e: boolean) => void;
};

type BusinessProfileSectionProps = {
  isEditing: boolean;
  setIsEditing: (e: boolean) => void;
  component: React.FC<BusinessProfileComponentProps>;
  editComponent?: React.FC<BusinessProfileComponentProps>;
};

const BusinessProfileSection: React.FC<BusinessProfileSectionProps> = ({
  isEditing,
  setIsEditing,
  component: Component,
  editComponent: EditComponent
}) => {
  return (
    <section className="flex flex-col gap-8 w-full px-8 pb-8">
      {EditComponent && isEditing ? (
        <EditComponent setIsEditing={setIsEditing} />
      ) : (
        <Component setIsEditing={setIsEditing} />
      )}
    </section>
  );
};

export default BusinessProfileSection;
