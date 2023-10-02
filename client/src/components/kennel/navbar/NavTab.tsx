import { useLocation } from 'react-router-dom';

interface NavTabProps {
  side?: string;
  name: string;
  path: string;
}

const NavTab: React.FC<NavTabProps> = ({ side, name, path }) => {
  const { pathname } = useLocation();
  return (
    <a
      href={path}
      className={`py-2 text-sm cursor-pointer transition duration-300 hover:text-neutral-500 border-b-[1px] hover:border-neutral-200
      ${
        side === 'left'
          ? 'pl-6 pr-4 rounded-l-full'
          : side === 'right'
          ? 'pl-4 pr-6 rounded-r-full'
          : 'px-4'
      }
      ${path === pathname && 'text-sky-500 border-sky-200'}`}
    >
      {name}
    </a>
  );
};

export default NavTab;
