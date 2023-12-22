import ListingStage from '../../../components/listing/listing/ListingStage';
import MediaUpload from '../../../components/listing/listingCreator/media/MediaUpload';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Media = () => {
  return (
    <ListingCreatorLayout>
      {/* MEDIA */}
      <ListingStage title="Media" subtitle="Say cheese!">
        <MediaUpload />
      </ListingStage>
    </ListingCreatorLayout>
  );
};

export default Media;
