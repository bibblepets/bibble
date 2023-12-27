import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SectionCardProps {
  title: string;
  field: string;
  preview?: () => JSX.Element;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  field,
  preview: Preview
}) => {
  const navigate = useNavigate();
  const [, , , listingId, stage] = location.pathname.split('/');

  const onNavigate = useCallback(() => {
    navigate(`/listing/edit/${listingId}/${field}`);
  }, [navigate]);

  return (
    <div
      onClick={onNavigate}
      className={`flex flex-col gap-4 border rounded-lg py-4 px-6 cursor-pointer transition ${
        field === stage && 'border-[2px] border-gray-500 shadow'
      }`}
    >
      <h4 className={field === stage ? 'font-semibold' : ''}>{title}</h4>
      {Preview && <Preview />}
    </div>
  );
};

export default SectionCard;
