import { useSelector } from 'react-redux';
import {
  selectListingEditorError,
  selectListingEditorIsLoading,
  selectListingEditorStatus,
  updateListingById,
  updateListingMediaById
} from '../../../features/listingEditorSlice';
import { useCallback } from 'react';
import { store } from '../../../store';
import FadeComponent from '../../wrapper/FadeComponent';

interface ListingEditorSectionProps {
  title?: string;
  description?: string;
  field: string;
  children: React.ReactNode;
}

const ListingEditorSection: React.FC<ListingEditorSectionProps> = ({
  title,
  description,
  field,
  children
}) => {
  const status = useSelector(selectListingEditorStatus);
  const error = useSelector(selectListingEditorError);
  const isLoading = useSelector(selectListingEditorIsLoading);
  const isError = status === 'ERROR' && error?.includes(field);

  const onSave = useCallback(() => {
    if (field === 'media') {
      store.dispatch(updateListingMediaById());
    } else {
      store.dispatch(updateListingById());
    }
  }, [store]);

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="flex flex-col gap-6 p-12 h-full">
        <div className="flex justify-between items-center">
          <h2 className={`font-medium text-4xl ${isError && 'text-rose-500'}`}>
            {title}
          </h2>
          {isError && <p className="text-sm text-rose-500">{'Required *'}</p>}
        </div>
        <p className="font-light text-gray-600 mb-4">{description}</p>
        <FadeComponent show={!isLoading}>{children}</FadeComponent>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col">
        <hr />
        <div className="flex justify-end">
          <button
            onClick={onSave}
            disabled={isLoading}
            className={`flex justify-center px-8 py-3 mb-6 mt-8 mx-12 rounded-lg transition text-white font-semibold ${
              isLoading ? 'bg-gray-300' : 'bg-gray-800 hover:bg-gray-900'
            }`}
            style={{ width: '100px' }}
          >
            {isLoading ? (
              <div className="loader flex flex-row justify-center gap-1">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingEditorSection;
