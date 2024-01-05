import React, { useCallback } from 'react';
import BaseModal from './BaseModal';
import { useSelector } from 'react-redux';
import {
  closeConfirmDeleteModal,
  selectConfirmDeleteModalIsOpen,
  selectConfirmDeleteModalNavigate
} from '../../features/modalsSlice';
import { store } from '../../store';
import { deleteListingCreatorById } from '../../features/listingCreatorSlice';

const ConfirmDeleteModal = () => {
  const isOpen = useSelector(selectConfirmDeleteModalIsOpen);
  const navigate = useSelector(selectConfirmDeleteModalNavigate);

  const onClose = useCallback(() => {
    store.dispatch(closeConfirmDeleteModal());
  }, [store]);

  const onConfirmDelete = useCallback(async () => {
    const action = await store.dispatch(deleteListingCreatorById());

    if (navigate && deleteListingCreatorById.fulfilled.match(action)) {
      store.dispatch(closeConfirmDeleteModal());
      navigate('/listing');
    }
  }, [store, isOpen, navigate]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <h1 className="text-2xl font-semibold mb-4">Confirm Delete</h1>
      <p className="text-gray-500 mb-8">
        Are you sure you want to delete this listing? <br /> This action cannot
        be undone.
      </p>
      <hr />
      <br />
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-gray-800 bg-opacity-60 hover:bg-opacity-100"
        >
          Back to Listing
        </button>
        <button
          onClick={onConfirmDelete}
          className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-white bg-rose-800 bg-opacity-60 hover:bg-opacity-100"
        >
          Confirm Delete
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmDeleteModal;
