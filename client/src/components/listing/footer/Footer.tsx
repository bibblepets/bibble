import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.replace(/^\/listing\/*/, '');

  const stages = ['', 'biology', 'geography', 'medical', 'media', 'legal'];

  const onBack = useCallback(() => {
    const index = stages.indexOf(pathname);
    if (index > 0) {
      navigate(
        '/listing' + (stages[index - 1] === '' ? '' : '/' + stages[index - 1])
      );
    }
  }, [stages, pathname, navigate]);

  const onNext = useCallback(() => {
    const index = stages.indexOf(pathname);
    if (index < stages.length - 1) {
      navigate(
        '/listing' + (stages[index + 1] === '' ? '' : '/' + stages[index + 1])
      );
    }
  }, [stages, pathname, navigate]);

  if (pathname === '') {
    return <a className="fixed w-full bottom-0 z-40 bg-white h-[84px]" />;
  }

  return (
    <footer className="fixed w-full bottom-0 z-40">
      <hr className="border-gray-200 border-b-4" />
      <div className="flex justify-between bg-white">
        <button onClick={onBack} className="px-8 py-3 m-4 underline">
          {'Back'}
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 my-4 mx-8 rounded-lg bg-gray-800 transition hover:bg-gray-900 text-white font-semibold"
        >
          {pathname !== 'legal' ? 'Next' : 'Finish'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
