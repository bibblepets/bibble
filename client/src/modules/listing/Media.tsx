import ListingStage from '../../components/listing/listing/ListingStage';
import MediaUpload from '../../components/listing/media/MediaUpload';
import ListingLayout from '../../layouts/ListingLayout';

const Media = () => {
  return (
    <ListingLayout>
      {/* MEDIA */}
      <ListingStage title="Media" subtitle="Say cheese!">
        <MediaUpload />
      </ListingStage>
    </ListingLayout>
  );
};

export default Media;
