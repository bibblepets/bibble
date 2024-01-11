import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { selectListingOptionsHairCoats } from '../../../../features/listing/listingOptionsSlice';
import {
  selectListingEditorHairCoat,
  setHairCoat
} from '../../../../features/listing/listingEditorSlice';
import { HairCoat } from '../../../../features/listing/types';
import { toTitleCase } from '../../../../utils/string';

const HairCoatSelect = () => {
  const selectedHairCoat = useSelector(selectListingEditorHairCoat);
  const hairCoats = useSelector(selectListingOptionsHairCoats);

  const handleHairCoatSelected = (hairCoat: HairCoat) => {
    store.dispatch(setHairCoat(hairCoat));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-8 h-full w-full mx-8">
      {hairCoats.slice(0, 24).map((hairCoat, index) => (
        <button
          key={index}
          onClick={() => handleHairCoatSelected(hairCoat)}
          className={`flex justify-center h-[200px] w-full items-center border rounded-lg transition ${
            hairCoat._id === selectedHairCoat?._id &&
            'border-[2px] border-gray-500 font-semibold'
          }`}
        >
          {toTitleCase(hairCoat.name)}
        </button>
      ))}
    </div>
  );
};

export default HairCoatSelect;
