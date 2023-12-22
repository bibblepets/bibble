import { ArrowRightIcon, SquaresPlusIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../../store';
import { SaleType } from '../../../types';
import { createListingCreator } from '../../../features/listingCreatorSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/authSlice';

const ListingOptions = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const canListSale = currentUser?.businessProfile?.bibbleTier !== 'Basic';

  const onStart = useCallback(
    async (saleType: SaleType) => {
      if (!currentUser) {
        return;
      }

      const response = await store.dispatch(
        createListingCreator({ currentUser, saleType })
      );
      const { _id } = response.payload;
      navigate(`/listing/create/${_id}/Biology`);
    },
    [store, navigate]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={() => onStart('Adoption')}
        className="flex flex-row gap-4"
      >
        <div className="p-4 bg-sky-500 rounded-lg">
          <SquaresPlusIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-1 p-1">
          <div className="flex flex-row items-center gap-2">
            <a className="text-sm font-medium">List an Adoption</a>
            <ArrowRightIcon className="w-3 h-3" strokeWidth={3} />
          </div>
          <p className="text-sm font-light text-gray-500 whitespace-nowrap overflow-hidden">
            Create a listing for an adoption
          </p>
        </div>
      </button>

      <button
        disabled={!canListSale}
        onClick={() => onStart('Sale')}
        className="flex flex-row gap-4"
      >
        <div
          className={`p-4 ${
            canListSale ? 'bg-rose-500' : 'bg-gray-500'
          } rounded-lg`}
        >
          <SquaresPlusIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-1 p-1">
          <div className="flex flex-row items-center gap-2">
            <a
              className={`text-sm font-medium ${
                !canListSale && 'text-gray-500'
              }`}
            >
              List a Sale
            </a>
            <ArrowRightIcon
              className={`w-3 h-3 ${!canListSale && 'text-gray-500'}`}
              strokeWidth={3}
            />
          </div>
          <p className="text-sm font-light text-gray-500 whitespace-nowrap overflow-hidden">
            {canListSale
              ? 'Create a listing for sale'
              : 'Upgrade your Bibble Tier to list a sale'}
          </p>
        </div>
      </button>
    </div>
  );
};

export default ListingOptions;
