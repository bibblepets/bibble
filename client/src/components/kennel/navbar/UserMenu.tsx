import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import pfp from '../../../assets/dog8.jpeg';
import { logoutUser, selectIsAuthenticated } from '../../../features/authSlice';
import {
  openLoginModal,
  openRegisterModal
} from '../../../features/modalsSlice';
import { store } from '../../../store';

interface UserMenuProps {
  tabs: { name: string; path: string }[];
}

const UserMenu: React.FC<UserMenuProps> = ({ tabs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const logout = useCallback(() => {
    store.dispatch(logoutUser());
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex justify-end w-[75px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border rounded-full shadow:md hover:shadow-xl active:scale-95 transform transition-transform duration-300"
          >
            <Bars3Icon className="h-5 w-5 m-2" aria-hidden="true" />
          </button>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full right-10 mt-2 w-48 rounded-md shadow-lg bg-white transition duration-300"
          >
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {tabs.map((tab, index) => (
                <a
                  key={index}
                  href={tab.path}
                  className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  {tab.name}
                </a>
              ))}

              <hr className="m-4" />

              <button
                onClick={() => store.dispatch(openLoginModal())}
                className="block px-4 py-3 w-full text-sm text-left transition leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Login
              </button>
              <button
                onClick={() => store.dispatch(openRegisterModal())}
                className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <a
          href="/messages"
          className="border rounded-2xl shadow:md hover:shadow-xl active:scale-95 transform transition-transform duration-300"
        >
          <BellIcon className="h-5 w-5 my-1 mx-2" aria-hidden="true" />
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border rounded-2xl shadow-md hover:shadow-xl active:scale-95 transform transition-transform duration-300"
        >
          <img className="h-8 w-8 border rounded-full" src={pfp} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-10 mt-2 w-48 rounded-md shadow-lg bg-white transition duration-300"
        >
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {tabs.map((tab, index) => (
              <a
                key={index}
                href={tab.path}
                className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {tab.name}
              </a>
            ))}
            <hr className="mx-4" />
            <button
              onClick={logout}
              className="block px-4 py-3 w-full text-sm text-left transition leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserMenu;
