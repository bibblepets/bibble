import { useNavigate } from 'react-router-dom';
import SectionCard from './SectionCard';

type Section = {
  title: string;
  preview: React.ReactNode;
};

const sections: Section[] = [
  {
    title: 'Photos',
    preview: <div>This is the preview</div>
  },
  {
    title: 'Name',
    preview: <div>This is the preview</div>
  },
  {
    title: 'Description',
    preview: <div>This is the preview</div>
  }
];

const SectionList = () => {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          title={section.title}
          preview={section.preview}
        />
      ))}
    </div>
  );
};

export default SectionList;
