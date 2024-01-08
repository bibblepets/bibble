import { useNavigate } from 'react-router-dom';
import { ListingCreator } from '../../../features/listing/types';

const stageMap = [
  'Biology',
  'Biography',
  'Medical',
  'Legal',
  'Media',
  'Price',
  'Summary'
];

export const useResume = (listingCreator: ListingCreator) => {
  const navigate = useNavigate();

  const resume = () => {
    navigate(
      `/listing/create/${listingCreator._id}/${stageMap[listingCreator.stage]}`
    );
  };

  return resume;
};
