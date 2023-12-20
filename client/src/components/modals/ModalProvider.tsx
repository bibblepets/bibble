import ConfirmDeleteModal from './ConfirmDeleteModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const ModalProvider = () => {
  return (
    <>
      <RegisterModal />
      <LoginModal />
      <ConfirmDeleteModal />
    </>
  );
};

export default ModalProvider;
