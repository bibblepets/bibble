import NavTabGroup from './NavTabGroup';
import UserMenu from '../../global/UserMenu';
import Logo from '../../global/Logo';

const Navbar = () => {
  const tabs = [
    { name: 'Featured', path: '/featured' },
    { name: 'Explore', path: '/' },
    { name: 'Rescue', path: '/rescue' }
  ];

  return (
    <nav className="sticky w-full top-0 z-40">
      <div className="flex flex-row px-8 justify-between items-center p-6 bg-white rounded-b-3xl">
        <Logo />
        <NavTabGroup tabs={tabs} />
        <UserMenu tabs={tabs} />
      </div>
    </nav>
  );
};

export default Navbar;
