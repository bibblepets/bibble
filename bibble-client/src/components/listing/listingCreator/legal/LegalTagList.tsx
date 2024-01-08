import { CheckIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  addLegalTag,
  removeLegalTag,
  selectListingCreatorLegalTags
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { LegalTag } from '../../../../types';
import { selectListingOptionsLegalTags } from '../../../../features/listing/listingOptionsSlice';

const LegalTagList = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedLegalTags = useSelector(selectListingCreatorLegalTags);
  const legalTags = useSelector(selectListingOptionsLegalTags);

  const handleClick = useCallback(
    (legalTag: LegalTag) => {
      if (selectedLegalTags?.includes(legalTag)) {
        store.dispatch(removeLegalTag(legalTag));
      } else {
        store.dispatch(addLegalTag(legalTag));
      }
    },
    [store, selectedLegalTags]
  );

  const formatTag = (tag: LegalTag) => {
    let formattedTag = tag
      .replace(/^is/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();

    let words = formattedTag.split(' ');
    if (words.length > 1) {
      words[0] = words[0].toUpperCase();
      formattedTag = words.join(' ');
    }

    return formattedTag;
  };

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {legalTags.map((tag, index) => (
        <div key={index} className="flex flex-row gap-4 items-center">
          <button
            onClick={() => handleClick(tag as LegalTag)}
            disabled={readOnly}
            className="p-2 rounded-lg border transition hover:shadow-inner"
          >
            {selectedLegalTags?.includes(tag as LegalTag) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {formatTag(tag)}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LegalTagList;
