import { ChangeEvent, useCallback } from 'react';
import { BiLogoGoogle, BiLogoLinkedin } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo-icon.png';
import { registerUser, selectIsAuthenticated } from '../../features/authSlice';
import {
  closeRegisterModal,
  openLoginModal,
  resetRegisterModal,
  selectIsRegisterModalOpen,
  selectRegisterModalEmail,
  selectRegisterModalName,
  selectRegisterModalPassword,
  updateRegisterModalEmail,
  updateRegisterModalName,
  updateRegisterModalPassword
} from '../../features/modalsSlice';
import { store } from '../../store';
import BaseModal from './BaseModal';

const RegisterModal = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOpen = useSelector(selectIsRegisterModalOpen);
  const name = useSelector(selectRegisterModalName);
  const email = useSelector(selectRegisterModalEmail);
  const password = useSelector(selectRegisterModalPassword);

  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.dispatch(updateRegisterModalName(e.target.value));
    },
    [store]
  );

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.dispatch(updateRegisterModalEmail(e.target.value));
    },
    [store]
  );

  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.dispatch(updateRegisterModalPassword(e.target.value));
    },
    [store]
  );

  const onClose = useCallback(() => {
    store.dispatch(closeRegisterModal());
  }, [store]);

  const onSubmit = useCallback(() => {
    store.dispatch(registerUser({ name, email, password }));
    store.dispatch(resetRegisterModal());
    store.dispatch(closeRegisterModal());
  }, [store, name, email, password]);

  const onToggle = useCallback(() => {
    store.dispatch(closeRegisterModal());
    store.dispatch(openLoginModal());
  }, [store]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <img className="h-[32px]" src={logo} alt="bibble-logo" />
        <a className="font-semibold text-xl text-neutral-700">
          Register your account
        </a>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <a className="text-sm text-neutral-500">Full Name</a>
            <input
              className="border rounded-lg p-2 text-sm"
              type="text"
              value={name}
              onChange={onChangeName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <a className="text-sm text-neutral-500">Email</a>
            <input
              className="border rounded-lg p-2 text-sm"
              type="text"
              value={email}
              onChange={onChangeEmail}
            />
          </div>

          <div className="flex flex-col gap-2">
            <a className="text-sm text-neutral-500">Password</a>
            <input
              className="border rounded-lg p-2 text-sm"
              type="password"
              value={password}
              onChange={onChangePassword}
            />
          </div>
        </div>

        <div className="flex items-center w-full px-2 justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox w-4 h-4 text-neutral-500 cursor-pointer"
            />
            <span className="text-sm text-neutral-500">Remember me</span>
          </label>

          <a className="text-sm text-sky-500 font-semibold transition cursor-pointer hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          onClick={onSubmit}
          className="bg-sky-500 text-white w-full font-semibold text-sm rounded-lg p-3 transition hover:bg-opacity-70 hover:shadow-inner"
        >
          Register
        </button>

        <div className="flex flex-row w-full items-center gap-2">
          <hr className="w-full mx-4" />
          <a className="text-sm text-neutral-500 whitespace-nowrap">
            Or continue with
          </a>
          <hr className="w-full mx-4" />
        </div>

        <div className="flex justify-between w-full gap-4">
          <button
            onClick={() => alert('Google not implemented yet')}
            className="flex border justify-center items-center p-2 w-full rounded-lg gap-2 transition hover:bg-gray-100 hover:shadow-inner"
          >
            <BiLogoGoogle size={20} />
            <a className="text-sm">Google</a>
          </button>
          <button
            onClick={() => alert('LinkedIn not implemented yet')}
            className="flex border justify-center items-center p-2 w-full rounded-lg gap-2 bg-sky-500 transition hover:opacity-70 hover:shadow-inner"
          >
            <BiLogoLinkedin color="white" size={20} />
            <a className="text-sm text-white">LinkedIn</a>
          </button>
        </div>

        <div className="flex flex-row justify-center w-full items-center gap-2">
          <a className="text-sm text-neutral-500 whitespace-nowrap">
            Already have an account?
          </a>
          <a
            onClick={onToggle}
            className="text-sm font-semibold text-sky-500 whitespace-nowrap cursor-pointer hover:underline"
          >
            Sign in here
          </a>
        </div>
      </div>
    </BaseModal>
  );
};

export default RegisterModal;
