import Logo from './Logo';

const Navbar = () => {
  return (
    <nav className="absolute w-full top-0 z-40">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white rounded-b-3xl">
        <Logo />
        <div className="flex gap-4">
          <button
            onClick={() => alert('Help button clicked!')}
            className="border rounded-full shadow-md hover:shadow-lg active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
          >
            Help?
          </button>
          <button
            onClick={() => alert('Save & Exit button clicked!')}
            className="border rounded-full shadow-md hover:shadow-lg active:scale-95 transition duration-300 text-sm px-4 py-2 text-neutral-500"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
