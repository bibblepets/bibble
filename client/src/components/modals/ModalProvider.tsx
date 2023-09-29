import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const ModalProvider = () => {
  return (
    <>
      <RegisterModal />
      <LoginModal />
    </>
  );
};

export default ModalProvider;
