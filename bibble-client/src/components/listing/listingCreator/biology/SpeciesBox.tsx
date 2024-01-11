import { useCallback } from 'react';
import { IconType } from 'react-icons';
import { useSelector } from 'react-redux';
import { toTitleCase } from '../../../../utils/string';
import { Species } from '../../../../features/listing/types';
import {
  selectListingCreatorSpecies,
  setSpecies
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';

interface SpeciesBoxProps {
  species: Species;
  icon: IconType;
}

const SpeciesBox: React.FC<SpeciesBoxProps> = ({ species, icon: Icon }) => {
  const selectedSpecies = useSelector(selectListingCreatorSpecies);

  const onSelect = useCallback(
    (s: Species) => {
      store.dispatch(setSpecies(s));
    },
    [store]
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => onSelect(species)}
        className={`p-4 rounded-lg transition ${
          selectedSpecies?._id === species._id ? 'bg-sky-500' : 'bg-gray-500'
        }`}
      >
        <Icon className="text-white w-6 h-6" />
      </button>
      <a className={`text-sm font-light text-gray-500`}>
        {toTitleCase(species.name)}
      </a>
    </div>
  );
};

export default SpeciesBox;
