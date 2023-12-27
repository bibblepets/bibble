import Logo from '../../../global/Logo';
import UserMenu from '../../../global/UserMenu';

const Navbar = () => {
  return (
    <nav className="absolute w-full flex flex-row px-8 justify-between items-center p-6 border-b">
      <Logo small />
      <UserMenu tabs={[]} />
    </nav>
  );
};

export default Navbar;
