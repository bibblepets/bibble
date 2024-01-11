import React from 'react';

interface DefaultPreviewProps {
  text?: string;
  subtext?: string;
}

const DefaultPreview: React.FC<DefaultPreviewProps> = ({ text, subtext }) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="font-light text-gray-500 line-clamp-5">{text}</p>
      {subtext && <p className="text-xs text-gray-800">{subtext}</p>}
    </div>
  );
};
export default DefaultPreview;
