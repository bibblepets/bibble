import { useParams } from 'react-router-dom';
import { sections } from '../../../../modules/listing/listingEditor/hooks';
import SectionCard from './SectionCard';

const SectionList = () => {
  const { stage } = useParams();

  return (
    <div
      className={`flex flex-col gap-4 ${
        stage ? 'pl-40 pr-12' : 'px-8'
      } pb-24 overflow-auto`}
    >
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          field={section.field}
          title={section.title}
          preview={section.preview}
        />
      ))}
    </div>
  );
};

export default SectionList;
