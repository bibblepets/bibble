import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useCallback } from 'react';
import { store } from '../../../../store';
import { updateListingCreatorById } from '../../../../features/listingCreatorSlice';
import { openConfirmDeleteModal } from '../../../../features/modalsSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, , , , stage] = location.pathname.split('/');

  const handleSaveAndExit = useCallback(async () => {
    const action = await store.dispatch(updateListingCreatorById());

    if (updateListingCreatorById.fulfilled.match(action)) {
      navigate('/listing');
    }
  }, [store, navigate]);

  const handleDelete = useCallback(async () => {
    store.dispatch(openConfirmDeleteModal(navigate));
  }, [store, navigate]);

  const buttons =
    stage && stage !== '' ? (
      <>
        <button
          onClick={handleDelete}
          className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-white bg-rose-800 bg-opacity-60 hover:bg-opacity-100"
        >
          Delete Listing
        </button>
        <button
          onClick={() => alert('Help button clicked!')}
          className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          Help?
        </button>
        <button
          onClick={handleSaveAndExit}
          className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
        >
          Save & Exit
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
    <nav className="fixed w-full top-0 z-40">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white">
        <Logo />
        <div className="flex gap-4">{buttons}</div>
      </div>
    </nav>
  );
};

export default Navbar;
