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
    <nav className="absolute w-full top-0">
      <div className="flex flex-row px-8 justify-between items-center p-4">
        <Logo />
        <NavTabGroup tabs={tabs} />
        <UserMenu tabs={tabs} />
      </div>
    </nav>
  );
};

export default Navbar;
