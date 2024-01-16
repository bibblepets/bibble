import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { selectListingOptionsLegalTags } from '../../../../features/listing/listingOptionsSlice';
import AvsLicenseInput from './AvsLicenseInput';
import {
  addLegalTag,
  removeLegalTag,
  selectListingEditorLegalTags
} from '../../../../features/listing/listingEditorSlice';
import { LegalTag } from '../../../../features/listing/types';

const LegalTagList = () => {
  const selectedLegalTags = useSelector(selectListingEditorLegalTags);
  const legalTags = useSelector(selectListingOptionsLegalTags);

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

  const isSelected = (tag: LegalTag) =>
    selectedLegalTags?.map((t) => t._id)?.includes(tag._id);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <AvsLicenseInput />
      <hr />

      {legalTags.map((tag, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <label>{tag.name}</label>
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

          {index !== tag.name.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default LegalTagList;
