import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { LegalTag } from '../../../../types';
import { selectListingOptionsLegalTags } from '../../../../features/listingOptionsSlice';
import AvsLicenseInput from './AvsLicenseInput';
import {
  addLegalTag,
  removeLegalTag,
  selectListingEditorLegalTags
} from '../../../../features/listingEditorSlice';

const LegalTagList = () => {
  const selectedLegalTags = useSelector(selectListingEditorLegalTags);
  const legalTags = useSelector(selectListingOptionsLegalTags);

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

  const onAdd = useCallback(
    (tag: LegalTag) => {
      if (isSelected(tag)) {
        return;
      }
      store.dispatch(addLegalTag(tag));
    },
    [store, selectedLegalTags]
  );

  const onRemove = useCallback(
    (tag: LegalTag) => {
      store.dispatch(removeLegalTag(tag));
    },
    [store, selectedLegalTags]
  );

  const isSelected = (tag: LegalTag) => selectedLegalTags?.includes(tag);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <AvsLicenseInput />
      <hr />

      {legalTags.map((tag, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <label>{formatTag(tag)}</label>
            </div>

            <div className="flex flex-row gap-4">
              <button
                onClick={() => onRemove(tag)}
                className={`border rounded-full p-2 h-[34px] w-[34px] transition ${
                  !isSelected(tag) && 'bg-gray-800'
                }`}
              >
                <XMarkIcon
                  className={`w-4 h-4 text-gray-500 transition ${
                    !isSelected(tag) && 'text-white'
                  }`}
                />
              </button>

              <button
                onClick={() => onAdd(tag)}
                className={`border rounded-full p-2 h-[34px] w-[34px] transition ${
                  isSelected(tag) && 'bg-gray-800'
                }`}
              >
                <CheckIcon
                  className={`w-4 h-4 text-gray-500 transition ${
                    isSelected(tag) && 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {index !== tag.length - 1 && <hr />}
        </div>
        // <div key={index} className="flex flex-row gap-4 items-center">
        //   <button
        //     onClick={() => handleClick(tag as LegalTag)}
        //     disabled={readOnly}
        //     className="p-2 rounded-lg border transition hover:shadow-inner"
        //   >
        //     {selectedLegalTags?.includes(tag as LegalTag) ? (
        //       <CheckIcon className="w-4 h-4" />
        //     ) : (
        //       <div className="w-4 h-4" />
        //     )}
        //   </button>
        //   <a key={index} className="text-sm font-light text-gray-500">
        //     {formatTag(tag)}
        //   </a>
        // </div>
      ))}
    </div>
  );
};

export default LegalTagList;
