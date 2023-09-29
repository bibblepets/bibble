import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Searchbar = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-row items-center px-4 py-2 border rounded-full gap-2 shadow-inner">
        <input
          type="text"
          className="text-sm outline-none w-96"
          placeholder="Search"
        />
        <MagnifyingGlassIcon
          className="h-4 w-4 text-gray-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Searchbar;
