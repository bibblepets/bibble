import { useSelector } from 'react-redux';
import {
  selectListingCreatorError,
  selectListingCreatorStatus
} from '../../../features/listingCreatorSlice';

interface ListingSectionProps {
  title: string;
  field: string;
  children: React.ReactNode;
}

const ListingSection: React.FC<ListingSectionProps> = ({
  title,
  field,
  children
}) => {
  const status = useSelector(selectListingCreatorStatus);
  const error = useSelector(selectListingCreatorError);
  const isError = status === 'ERROR' && error?.includes(field);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 justify-between items-center">
        <h2 className={`font-medium text-lg ${isError && 'text-rose-500'}`}>
          {title}
        </h2>
        {isError && <p className="text-sm text-rose-500">{'Required *'}</p>}
      </div>
      {children}
    </div>
  );
};

export default ListingSection;
