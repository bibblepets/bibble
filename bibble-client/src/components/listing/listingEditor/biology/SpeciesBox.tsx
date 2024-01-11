import { useCallback } from 'react';
import { IconType } from 'react-icons';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorSpecies,
  setSpecies
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { toTitleCase } from '../../../../utils/string';
import { Species } from '../../../../features/listing/types';

interface SpeciesBoxProps {
  species: Species;
  icon: IconType;
  disabled?: boolean;
}

const SpeciesBox: React.FC<SpeciesBoxProps> = ({
  species,
  icon: Icon,
  disabled
}) => {
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
          selectedSpecies === species
            ? 'bg-sky-500'
            : disabled
              ? 'bg-gray-300'
              : 'bg-gray-500'
        }`}
        disabled={disabled}
      >
        <Icon className="text-white w-6 h-6" />
      </button>
      <a
        className={`text-sm font-light ${
          disabled ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        {toTitleCase(species.name)}
      </a>
    </div>
  );
};

export default SpeciesBox;
