import logo from '/images/logo-icon.png';

const Logo = () => {
  return (
    <a href="/">
      <img className="h-[20px]" src={logo} alt="bibble-logo" />
    </a>
  );
};

export default Logo;
