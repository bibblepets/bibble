import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Searchbar = () => {
  return (
    <div className="flex justify-center items-center gap-8">
      <div className="flex flex-row items-center px-4 py-2 border rounded-full gap-2 shadow-inner">
        <input
          type="text"
          className="text-sm outline-none w-96"
          placeholder="Search"
        />
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
      </div>

      <button className="flex gap-2 items-center rounded-full border px-4 py-2 text-neutral-500 shadow-md hover:shadow-xl active:scale-95 transition duration-300">
        <AdjustmentsHorizontalIcon
          className="h-5 w-5 text-gray-500"
          aria-hidden="true"
        />
        <a className="text-sm">Filters</a>
      </button>
    </div>
  );
};

export default Searchbar;
