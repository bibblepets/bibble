import { useLocation, useNavigate } from 'react-router-dom';
import { ListingStage } from '../../../types';
import { useProgress } from './hooks';
import ProgressBar from './ProgressBar';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, , listingId, stage] = location.pathname.split('/');

  const stages: ListingStage[] = [
    '',
    'Biology',
    'Biography',
    'Medical',
    'Legal',
    'Media',
    'Price',
    'Summary'
  ];

  const { onBack, onNext } = useProgress(
    navigate,
    stage as ListingStage,
    listingId
  );

  if (!stage || stage === '') {
    return <a className="fixed w-full bottom-0 z-40 bg-white h-[84px]" />;
  }

  return (
    <footer className="fixed w-full bottom-0 z-40">
      <ProgressBar
        stage={stages.indexOf(stage as ListingStage)}
        totalStages={stages.length}
      />
      <div className="flex justify-between bg-white">
        <button onClick={onBack} className="px-8 py-3 m-4 underline">
          {'Back'}
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 my-4 mx-8 rounded-lg bg-gray-800 transition hover:bg-gray-900 text-white font-semibold"
        >
          {stage !== stages[stages.length - 1] ? 'Next' : 'Finish'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
