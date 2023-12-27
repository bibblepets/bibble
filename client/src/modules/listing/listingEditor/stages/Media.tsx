import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import MediaUpload from '../../../../components/listing/listingEditor/media/MediaUpload';

const description = 'Manage photos and videos of your furry friend.';

const Media = () => {
  return (
    <ListingEditorSection
      title="Photo reel"
      field="name"
      description={description}
    >
      <MediaUpload />
    </ListingEditorSection>
  );
};

export default Media;
