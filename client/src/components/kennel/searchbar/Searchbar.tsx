import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import FilterButton from './FilterButton';

const Searchbar = () => {
  return (
    <div className="flex justify-center items-center gap-8 border-t-[1px] border-gray-100 shadow-sm">
      <div className="flex flex-row w-full items-center mx-12 my-6 gap-4 justify-between">
        <div className="flex flex-row gap-4 w-full">
          <MagnifyingGlassIcon
            className="h-4 w-4 text-gray-500"
            aria-hidden="true"
          />
          <input
            type="text"
            className="text-xs outline-none w-full"
            placeholder="Find your best friend..."
          />
        </div>
        <FilterButton />
      </div>
    </div>
  );
};

export default Searchbar;
