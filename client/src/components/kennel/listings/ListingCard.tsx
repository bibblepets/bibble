import placeholder from '../../../assets/dog1.jpeg';
import pfp from '../../../assets/dog8.jpeg';
import { useNavigate } from 'react-router-dom';

const ListingCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4" onClick={() => navigate('/kennel/details')}>
      <img
        className="rounded-3xl transition hover:scale-105 cursor-pointer"
        src={placeholder}
      />
      <div className="flex flex-col items-center gap-2">
        <a className="text-neutral-800">Golden Retriever</a>
        <a className="text-neutral-500">$300</a>
        <div className="flex items-center gap-2">
          <img
            className="h-6 w-6 border border-gray-300 rounded-full"
            src={pfp}
          />
          <a className="text-xs text-neutral-500">Posted by Titus Lowe</a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
