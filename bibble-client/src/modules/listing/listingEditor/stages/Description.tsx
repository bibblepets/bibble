import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import DescriptionInput from '../../../../components/listing/listingEditor/biography/DescriptionInput';

const Description = () => {
  return (
    <ListingEditorSection title="Description" field="description">
      <DescriptionInput />
    </ListingEditorSection>
  );
};

export default Description;
