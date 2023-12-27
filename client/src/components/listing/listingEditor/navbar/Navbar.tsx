import Logo from '../../../global/Logo';
import UserMenu from '../../../global/UserMenu';

const Navbar = () => {
  return (
    <nav className="sticky w-full top-0 z-40 border-b">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white rounded-b-3xl">
        <Logo small />
        <UserMenu tabs={[]} />
      </div>
    </nav>
  );
};

export default Navbar;
