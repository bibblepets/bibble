import placeholder from '../../../assets/dog1.jpeg';
import pfp from '../../../assets/dog8.jpeg';

const ListingCard = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        className="rounded-full shadow-xl border-4 border-gray-300"
        src={placeholder}
      />
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
  );
};

export default ListingCard;
