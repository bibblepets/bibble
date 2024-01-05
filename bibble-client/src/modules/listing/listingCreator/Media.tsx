import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import MediaUpload from '../../../components/listing/listingCreator/media/MediaUpload';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Media = () => {
  return (
    <ListingCreatorLayout>
      {/* MEDIA */}
      <ListingCreatorStage title="Media" subtitle="Say cheese!">
        <MediaUpload />
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Media;
