import { useSelector } from 'react-redux';
import {
  selectListingCreatorError,
  selectListingCreatorIsLoading,
  selectListingCreatorStatus
} from '../../../features/listingCreatorSlice';
import FadeComponent from '../../wrapper/FadeComponent';

interface ListingCreatorStageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ListingCreatorStage: React.FC<ListingCreatorStageProps> = ({
  title,
  subtitle,
  children
}) => {
  const status = useSelector(selectListingCreatorStatus);
  const error = useSelector(selectListingCreatorError);
  const isError =
    status === 'ERROR' && error?.includes(title.toLocaleLowerCase());
  const isLoading = useSelector(selectListingCreatorIsLoading);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full overflow-auto my-12">
      <FadeComponent show={!isLoading}>
        <div className="flex flex-col w-full sm:w-[640px] px-8 max-h-full gap-10">
          <div className="flex flex-col gap-2">
            {/* HEADER */}
            <div className="flex gap-2 justify-between items-center">
              <h2
                className={`font-semibold text-2xl ${
                  isError && 'text-rose-500'
                }`}
              >
                {title}
              </h2>
              {isError && (
                <p className="text-sm text-rose-500">{'Required *'}</p>
              )}
            </div>
            <p className="font-light text-gray-500">{subtitle}</p>
          </div>
          <hr className="mx-8 bg-sky-300" />

          {/* BODY */}
          {children}
        </div>
      </FadeComponent>
    </div>
  );
};

export default ListingCreatorStage;
