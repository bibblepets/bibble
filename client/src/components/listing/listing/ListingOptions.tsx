import {
  ArrowRightIcon,
  GiftIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ListingOptions = () => {
  const navigate = useNavigate();

  const onStart = useCallback(() => {
    navigate('/listing/biology');
  }, [navigate]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <button onClick={onStart} className="flex flex-row gap-4">
        <div className="p-4 bg-rose-500 rounded-lg">
          <SquaresPlusIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-1 p-1">
          <div className="flex flex-row items-center gap-2">
            <a className="text-sm font-medium">List a Pet</a>
            <ArrowRightIcon className="w-3 h-3" strokeWidth={3} />
          </div>
          <p className="text-sm font-light text-gray-500 whitespace-nowrap overflow-hidden">
            Create a listing for sale
          </p>
        </div>
      </button>

      <button
        onClick={() => alert('implement')}
        className="flex flex-row gap-4"
      >
        <div className="p-4 bg-sky-500 rounded-lg">
          <GiftIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col gap-1 p-1">
          <div className="flex flex-row items-center gap-2">
            <a className="text-sm font-medium">List a Service</a>
            <ArrowRightIcon className="w-3 h-3" strokeWidth={3} />
          </div>
          <p className="text-sm font-light text-gray-500 whitespace-nowrap overflow-hidden">
            Post a subscription service
          </p>
        </div>
      </button>

      <button onClick={() => alert('adoption')} className="flex flex-row gap-4">
        <div className="p-4 bg-rose-500 rounded-lg">
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
    </div>
  );
};

export default ListingOptions;
