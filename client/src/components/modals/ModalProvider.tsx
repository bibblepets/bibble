import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ViewMoreModal from './ViewMoreModal';

const ModalProvider = () => {
  return (
    <>
      <RegisterModal />
      <LoginModal />
      <ConfirmDeleteModal />
      <ViewMoreModal />
    </>
  );
};

export default ModalProvider;
