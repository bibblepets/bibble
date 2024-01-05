import {
  Bars3Icon,
  BellIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import paw from '/images/paw.jpeg';
import { logoutUser, selectCurrentUser } from '../../features/userSlice';
import { openLoginModal, openRegisterModal } from '../../features/modalsSlice';
import { store } from '../../store';

interface UserMenuProps {
  tabs: { name: string; path: string }[];
}

const UserMenu: React.FC<UserMenuProps> = ({ tabs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector(selectCurrentUser);

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

  if (!currentUser) {
    return (
      <div className="relative">
        <div className="flex justify-end w-64">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300"
          >
            <Bars3Icon className="h-5 w-5 m-2" aria-hidden="true" />
          </button>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white transition duration-300"
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
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-row justify-end items-center gap-4 w-64">
        <a
          href="/listing"
          className="hidden lg:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          <div className="flex flex-row gap-2">
            <BuildingStorefrontIcon className="h-5 w-5" />
            <p>Listing</p>
          </div>
        </a>
        <a
          href="/messages"
          className="hidden lg:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300"
        >
          <BellIcon className="h-5 w-5 m-2" aria-hidden="true" />
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border rounded-2xl shadow-md hover:scale-95 active:scale-95 transition duration-300"
        >
          <img
            className="object-cover h-8 w-8 rounded-full"
            src={currentUser?.buyerProfile?.profilePic?.url || paw}
          />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white transition duration-300"
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
            {tabs && tabs.length > 0 && <hr className="mx-4" />}
            <a
              href={'/profile'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Profile
            </a>
            <a
              href={'listing'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Listings
            </a>
            <a
              href={'/messages'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Messages
            </a>
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
    </div>
  );
};

export default UserMenu;
