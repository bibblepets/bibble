import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ControlHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-6 pl-24 items-center">
      <button
        onClick={() => navigate(`/listing`)}
        className="bg-gray-100 p-3 rounded-full transition hover:bg-gray-200"
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </button>
      <h1 className="text-3xl font-medium">My Listings</h1>
    </div>
  );
};

export default ControlHeader;
