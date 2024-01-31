import { Bars3Icon, BellIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  logoutBusiness,
  selectCurrentBusiness
} from '../../../features/business/businessSlice';
import { store } from '../../../store';
import paw from '/images/paw.jpeg';

interface BusinessMenuProps {
  tabs: { name: string; path: string }[];
}

const BusinessMenu: React.FC<BusinessMenuProps> = ({ tabs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentBusiness = useSelector(selectCurrentBusiness);

  const logout = useCallback(() => {
    store.dispatch(logoutBusiness());
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

  if (!currentBusiness) {
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

              <a
                href={'/business/register'}
                className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Register
              </a>
              <a
                href={'/business/login'}
                className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Login
              </a>
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
          href="/business"
          className="hidden lg:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          <div className="flex flex-row gap-2">
            <HomeIcon className="h-5 w-5" />
            <p>Dashboard</p>
          </div>
        </a>
        <a
          href="/business/messages"
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
            src={currentBusiness.media[0]?.url || paw}
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
              href={'/business/listing'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Listings
            </a>
            <a
              href={'/business/messages'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Messages
            </a>
            <a
              href={'/business/profile'}
              className="block px-4 py-3 w-full text-sm text-left leading-5 transition text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Profile
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

export default BusinessMenu;
