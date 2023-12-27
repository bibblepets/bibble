import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SectionCardProps {
  title: string;
  preview: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, preview }) => {
  const navigate = useNavigate();
  const [, , , listingId, stage] = location.pathname.split('/');

  const onNavigate = useCallback(() => {
    navigate(`/listing/edit/${listingId}/${title.toLowerCase()}`);
  }, [navigate]);

  return (
    <div
      onClick={onNavigate}
      className="flex flex-col gap-4 border rounded-lg py-4 px-6 cursor-pointer"
    >
      <h4>{title}</h4>
      {preview}
    </div>
  );
};

export default SectionCard;
