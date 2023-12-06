import { ChangeEvent, useCallback, useEffect } from 'react';
import { BiLogoGoogle, BiLogoLinkedin } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo-icon.png';
import {
  loginUser,
  resetStatus,
  selectAuthStatus
} from '../../features/authSlice';
import {
  closeLoginModal,
  openRegisterModal,
  resetLoginModal,
  selectIsLoginModalOpen,
  selectLoginModalEmail,
  selectLoginModalPassword,
  selectLoginModalTitle,
  updateLoginModalEmail,
  updateLoginModalPassword
} from '../../features/modalsSlice';
import { store } from '../../store';
import BaseModal from './BaseModal';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const LoginModal = () => {
  const isOpen = useSelector(selectIsLoginModalOpen);
  const email = useSelector(selectLoginModalEmail);
  const password = useSelector(selectLoginModalPassword);
  const status = useSelector(selectAuthStatus);
  const title = useSelector(selectLoginModalTitle);

  useEffect(() => {
    if (isOpen && status === 'SUCCESS') {
      setTimeout(onSuccess, 1000);
    }
  }, [status]);

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.dispatch(updateLoginModalEmail(e.target.value));
    },
    [store]
  );

  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.dispatch(updateLoginModalPassword(e.target.value));
    },
    [store]
  );

  const onClose = useCallback(() => {
    store.dispatch(closeLoginModal());
  }, [store]);

  const onSubmit = useCallback(() => {
    store.dispatch(loginUser({ email, password }));
  }, [store, email, password]);

  const onSuccess = useCallback(() => {
    store.dispatch(resetStatus());
    store.dispatch(resetLoginModal());
    store.dispatch(closeLoginModal());
  }, [store]);

  const onToggle = useCallback(() => {
    store.dispatch(closeLoginModal());
    store.dispatch(openRegisterModal());
  }, [store]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-8">
        <img className="h-[32px]" src={logo} alt="bibble-logo" />
        <a className="font-semibold text-xl text-neutral-700">{title}</a>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <a className="text-sm text-neutral-500">Email</a>
            <input
              className="border rounded-lg p-2 text-sm"
              type="text"
              value={email}
              onChange={onChangeEmail}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <a className="text-sm text-neutral-500">Password</a>
            <input
              className="border rounded-lg p-2 text-sm"
              type="password"
              value={password}
              onChange={onChangePassword}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center w-full px-2 justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="form-checkbox w-4 h-4 text-neutral-500 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                alert('Remember me not implemented yet');
              }}
            />
            <span className="text-sm text-neutral-500">Remember me</span>
          </label>

          <a
            className="text-sm text-sky-500 font-semibold transition cursor-pointer hover:underline"
            onClick={() =>
              alert('Forgot password redirect not implemented yet')
            }
          >
            Forgot password?
          </a>
        </div>

        {status === 'ERROR' && (
          <div className="flex flex-row gap-4 w-full justify-center items-center border border-red-500 rounded-lg p-2 text-sm">
            <InformationCircleIcon className="w-6 h-6 text-red-500" />
            <a className="text-sm text-red-500 whitespace-pre-line">
              {store.getState().authentication.error}
            </a>
          </div>
        )}

        <button
          onClick={onSubmit}
          className="flex justify-center items-center bg-sky-500 text-white w-full font-semibold text-sm rounded-lg p-3 transition hover:bg-opacity-70 hover:shadow-inner disabled:bg-neutral-400"
          disabled={status === 'LOADING'}
        >
          {status === 'LOADING' ? (
            <ArrowPathIcon className="animate-spin w-5 h-5" />
          ) : status === 'SUCCESS' ? (
            <>
              <CheckCircleIcon className="w-5 h-5" />
            </>
          ) : (
            <label>Sign In</label>
          )}
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
            Don't have an account?
          </a>
          <a
            onClick={onToggle}
            className="text-sm font-semibold text-sky-500 whitespace-nowrap cursor-pointer hover:underline"
          >
            Register here
          </a>
        </div>
      </div>
    </BaseModal>
  );
};

export default LoginModal;
