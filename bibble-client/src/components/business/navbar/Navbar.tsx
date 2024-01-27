import Logo from '../../global/Logo';
import UserMenu from '../../global/UserMenu';

const Navbar = () => {
  return (
    <nav className="absolute sticky flex justify-center w-full top-0 z-40 border-b bg-white">
      <div className="w-full max-w-screen-xl">
        <div className="flex flex-row px-8 justify-between items-center p-6">
          <Logo />
          <UserMenu tabs={[]} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
