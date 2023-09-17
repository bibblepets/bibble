import NavTab from './NavTab';

interface NavTabGroupProps {
  tabs: { name: string; path: string }[];
}

const NavTabGroup: React.FC<NavTabGroupProps> = ({ tabs }) => {
  return (
    <div className="flex flex-row border-[1px] rounded-full shadow-md">
      {tabs.map((tab, index) => (
        <NavTab
          key={index}
          side={index === 0 ? 'left' : index === tabs.length - 1 ? 'right' : ''}
          name={tab.name}
          path={tab.path}
        />
      ))}
    </div>
  );
};

export default NavTabGroup;
