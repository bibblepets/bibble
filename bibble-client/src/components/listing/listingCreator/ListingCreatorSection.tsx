import { useSelector } from 'react-redux';
import {
  selectListingCreatorError,
  selectListingCreatorStatus
} from '../../../features/listingCreatorSlice';

interface ListingCreatorSectionProps {
  title: string;
  field: string;
  optional?: boolean;
  children: React.ReactNode;
}

const ListingCreatorSection: React.FC<ListingCreatorSectionProps> = ({
  title,
  field,
  optional,
  children
}) => {
  const status = useSelector(selectListingCreatorStatus);
  const error = useSelector(selectListingCreatorError);
  const isError = status === 'ERROR' && error?.includes(field);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className={`font-medium text-lg ${isError && 'text-rose-500'}`}>
          {title}
        </h2>
        {optional && <p className="text-sm text-gray-400">{'Optional'}</p>}
        {isError && <p className="text-sm text-rose-500">{'Required *'}</p>}
      </div>
      {children}
    </div>
  );
};

export default ListingCreatorSection;
