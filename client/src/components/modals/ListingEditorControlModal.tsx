import React, { useCallback } from 'react';
import BaseModal from './BaseModal';
import { useSelector } from 'react-redux';
import {
  closeListingEditorControlModal,
  selectListingEditorControlModalIsOpen
} from '../../features/modalsSlice';
import { store } from '../../store';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { sections } from '../../modules/listing/listingEditor/hooks';

const ListingEditorControlModal = () => {
  const isOpen = useSelector(selectListingEditorControlModalIsOpen);

  const onClose = useCallback(() => {
    store.dispatch(closeListingEditorControlModal());
  }, [store]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-8 ">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="p-3 rounded-full transition hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-medium">My Listings</h1>
          <div className="h-[40px] w-[40px]" />
        </div>

        <div className="flex flex-col gap-4 overflow-auto">
          {sections.map((section, index) => (
            <a
              href={`./${section.field}`}
              className={`flex flex-col gap-2 shadow-md rounded-lg py-4 px-6 cursor-pointer transition border-[1px] border-gray-100 shadow`}
            >
              <h4>{section.title}</h4>
              {section.preview && <section.preview />}
            </a>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default ListingEditorControlModal;
