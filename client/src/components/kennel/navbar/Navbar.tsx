import Logo from './Logo';
import NavTabGroup from './NavTabGroup';
import UserMenu from './UserMenu';

const Navbar = () => {
  const tabs = [
    { name: 'Featured', path: '/featured' },
    { name: 'Explore', path: '/explore' },
    { name: 'Rescue', path: '/rescue' }
  ];

  return (
    <nav className="sticky w-full top-0 z-40">
      <div className="flex flex-row px-8 justify-between items-center pt-4 pb-6 bg-white rounded-b-3xl">
        <Logo />
        <NavTabGroup tabs={tabs} />
        <UserMenu tabs={tabs} />
      </div>
    </nav>
  );
};

export default Navbar;
