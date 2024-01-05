import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const FilterButton = () => {
  return (
    <button
      onClick={() => alert('implement')}
      className="flex gap-2 items-center rounded-full border p-2 text-neutral-500 shadow-md hover:scale-95 active:scale-95 transition duration-300"
    >
      <AdjustmentsHorizontalIcon
        className="h-4 w-4 text-gray-500"
        aria-hidden="true"
      />
    </button>
  );
};

export default FilterButton;
