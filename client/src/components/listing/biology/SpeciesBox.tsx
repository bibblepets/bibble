import { useCallback } from 'react';
import { IconType } from 'react-icons';
import { useSelector } from 'react-redux';
import {
  selectListingSpecies,
  setSpecies
} from '../../../features/listingSlice';
import { store } from '../../../store';
import { Species } from '../../../types';
import { toCamelCase } from '../../../utils/string';

interface SpeciesBoxProps {
  species: Species;
  icon: IconType;
}

const SpeciesBox: React.FC<SpeciesBoxProps> = ({ species, icon: Icon }) => {
  const selectedSpecies = useSelector(selectListingSpecies);

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
          selectedSpecies?.name === species.name ? 'bg-sky-500' : 'bg-gray-500'
        }`}
      >
        <Icon className="text-white w-6 h-6" />
      </button>
      <a className="text-sm font-light text-gray-500">
        {toCamelCase(species.name)}
      </a>
    </div>
  );
};

export default SpeciesBox;
