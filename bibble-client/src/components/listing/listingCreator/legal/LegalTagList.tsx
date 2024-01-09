import { CheckIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  addLegalTag,
  removeLegalTag,
  selectListingCreatorLegalTags,
  selectListingCreatorSpecies
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { selectListingOptionsLegalTags } from '../../../../features/listing/listingOptionsSlice';
import { LegalTag } from '../../../../features/listing/types';

const LegalTagList = ({ readOnly }: { readOnly?: boolean }) => {
  const species = useSelector(selectListingCreatorSpecies);
  const selectedLegalTags = useSelector(selectListingCreatorLegalTags);
  const allLegalTags = useSelector(selectListingOptionsLegalTags);
  const legalTags = allLegalTags.filter(
    (legalTag) => legalTag.speciesId === species?._id
  );

  const handleClick = useCallback(
    (legalTag: LegalTag) => {
      if (
        selectedLegalTags
          ?.map((legalTag) => legalTag._id)
          ?.includes(legalTag._id)
      ) {
        store.dispatch(removeLegalTag(legalTag));
      } else {
        store.dispatch(addLegalTag(legalTag));
      }
    },
    [store, selectedLegalTags]
  );

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {legalTags.map((tag, index) => (
        <div key={index} className="flex flex-row gap-4 items-center">
          <button
            onClick={() => handleClick(tag as LegalTag)}
            disabled={readOnly}
            className="p-2 rounded-lg border transition hover:shadow-inner"
          >
            {selectedLegalTags
              ?.map((legalTag) => legalTag._id)
              ?.includes(tag._id) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {tag.name}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LegalTagList;
