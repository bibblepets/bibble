import logo from '/images/logo.png';

const Logo = () => {
  return (
    <a href="/" className="w-64">
      <img className="h-[20px]" src={logo} alt="bibble-logo" />
    </a>
  );
};

export default Logo;
