import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import MediaUpload from '../../../../components/listing/listingEditor/media/MediaUpload';

const Media = () => {
  return (
    <ListingEditorSection
      title="Photo reel"
      field="media"
      description="Manage photos and videos of your furry friend"
    >
      <MediaUpload />
    </ListingEditorSection>
  );
};

export default Media;
