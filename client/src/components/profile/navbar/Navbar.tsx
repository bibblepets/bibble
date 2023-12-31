import UserMenu from '../../global/UserMenu';
import Logo from '../../global/Logo';

const Navbar = () => {
  return (
    <nav className="sticky max-w-screen-xl w-full top-0 z-40">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white rounded-b-3xl">
        <Logo />
        <UserMenu tabs={[]} />
      </div>
    </nav>
  );
};

export default Navbar;
