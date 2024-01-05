import { useSelector } from 'react-redux';
import {
  closeViewMoreModal,
  selectViewMoreModalContent,
  selectViewMoreModalIsOpen
} from '../../features/modalsSlice';
import BaseModal from './BaseModal';
import { useCallback } from 'react';
import { store } from '../../store';

const ViewMoreModal = () => {
  const isOpen = useSelector(selectViewMoreModalIsOpen);
  const content = useSelector(selectViewMoreModalContent);

  const onClose = useCallback(() => {
    store.dispatch(closeViewMoreModal());
  }, [store]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-semibold">Description</h1>
        <hr className="w-full" />
        <p className="text-gray-800 h-96 w-full whitespace-pre-line overflow-auto break-words"> {/*TODO: fix dynamic height*/}
          {content}
        </p>
        <hr className="w-full" />
      </div>
    </BaseModal>
  );
};

export default ViewMoreModal;
