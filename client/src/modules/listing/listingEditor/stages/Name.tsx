import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import NameInput from '../../../../components/listing/listingEditor/biography/NameInput';

const Name = () => {
  return (
    <ListingEditorSection field="name">
      <NameInput />
    </ListingEditorSection>
  );
};

export default Name;
