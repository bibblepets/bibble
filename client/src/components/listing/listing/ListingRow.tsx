import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ListingRowProps {
  species: string;
  breed: string;
  saleType: string;
  imgSrc?: string;
}

const ListingRow: React.FC<ListingRowProps> = ({
  species,
  breed,
  saleType,
  imgSrc
}) => {
  return (
    <button onClick={() => alert('implement')} className="flex flex-row gap-4">
      <div className="rounded-lg">
        {imgSrc ? (
          <img className="rounded-lg w-[52px] h-[52px]" src={imgSrc} />
        ) : (
          <div className="p-4 bg-gray-300 rounded-lg">
            <PhotoIcon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-1 p-1">
        <div className="flex flex-row items-center gap-2">
          <a className="text-sm font-medium">
            {breed} {species}
          </a>
          <PaperClipIcon className="w-3 h-3" strokeWidth={2} />
        </div>
        <p className="text-sm font-light text-gray-500">{saleType}</p>
      </div>
    </button>
  );
};

export default ListingRow;
