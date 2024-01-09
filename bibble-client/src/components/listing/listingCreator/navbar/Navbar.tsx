import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { store } from '../../../../store';
import { updateListingCreator } from '../../../../features/listing/listingCreatorSlice';
import { openConfirmDeleteModal } from '../../../../features/modalsSlice';
import Logo from '../../../global/Logo';
import {
  BookmarkSquareIcon,
  QuestionMarkCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, , , , stage] = location.pathname.split('/');

  const handleSaveAndExit = useCallback(async () => {
    const action = await store.dispatch(updateListingCreator());

    if (updateListingCreator.fulfilled.match(action)) {
      navigate('/listing');
    }
  }, [store, navigate]);

  const handleDelete = useCallback(async () => {
    store.dispatch(openConfirmDeleteModal(navigate));
  }, [store, navigate]);

  const buttons =
    stage && stage !== '' ? (
      <>
        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="hidden md:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-white bg-rose-800 bg-opacity-60 hover:bg-opacity-100"
        >
          Delete Listing
        </button>
        <button
          onClick={handleDelete}
          className="md:hidden border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm p-2 text-white bg-rose-800 bg-opacity-60 hover:bg-opacity-100"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        {/* HELP */}
        <button
          onClick={() => alert('Help button clicked!')}
          className="hidden md:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          Help?
        </button>
        <button
          onClick={() => alert('Help button clicked!')}
          className="md:hidden border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm p-2 text-neutral-500"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
        {/* SAVE & EXIT */}
        <button
          onClick={handleSaveAndExit}
          className="hidden md:block border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          Save & Exit
        </button>
        <button
          onClick={handleSaveAndExit}
          className="md:hidden border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm p-2 text-neutral-500"
        >
          <BookmarkSquareIcon className="h-5 w-5" />
        </button>
      </>
    ) : (
      <button
        onClick={() => navigate('/')}
        className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
      >
        Back to Kennel
      </button>
    );

  return (
    <nav className="fixed w-full top-0 z-40 border-b">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white">
        <Logo small />
        <div className="flex gap-4">{buttons}</div>
      </div>
    </nav>
  );
};

export default Navbar;
