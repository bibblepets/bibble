import { sections } from '../../../../modules/listing/listingEditor/hooks';
import SectionCard from './SectionCard';

const SectionList = () => {
  return (
    <div className="flex flex-col gap-4 pl-40 pr-12 pb-24 overflow-auto">
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
