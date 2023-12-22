import { useLocation, useNavigate } from 'react-router-dom';
import { ListingStage } from '../../../types';
import { useProgress } from './hooks';
import ProgressBar from './ProgressBar';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorBiographyIsCompleted,
  selectListingCreatorBiologyIsCompleted,
  selectListingCreatorIsLoading,
  selectListingCreatorLegalIsCompleted,
  selectListingCreatorMediaIsCompleted,
  selectListingCreatorMedicalIsCompleted,
  selectListingCreatorPriceIsCompleted
} from '../../../features/listingCreatorSlice';
import './styles.css';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, , , listingId, stage] = location.pathname.split('/');
  const isLoading = useSelector(selectListingCreatorIsLoading);

  let isCompleted;
  switch (stage) {
    case 'Biology':
      isCompleted = useSelector(selectListingCreatorBiologyIsCompleted);
      break;
    case 'Biography':
      isCompleted = useSelector(selectListingCreatorBiographyIsCompleted);
      break;
    case 'Medical':
      isCompleted = useSelector(selectListingCreatorMedicalIsCompleted);
      break;
    case 'Legal':
      isCompleted = useSelector(selectListingCreatorLegalIsCompleted);
      break;
    case 'Media':
      isCompleted = useSelector(selectListingCreatorMediaIsCompleted);
      break;
    case 'Price':
      isCompleted = useSelector(selectListingCreatorPriceIsCompleted);
      break;
    case 'Summary':
      isCompleted = true;
      break;
    default:
      isCompleted = false;
  }
  console.log(isCompleted);

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
        <button
          onClick={onBack}
          className="px-4 py-3 mx-8 my-4 underline rounded-lg hover:bg-gray-200"
        >
          {'Back'}
        </button>
        <button
          onClick={onNext}
          disabled={isLoading}
          className={`flex justify-center px-8 py-3 my-4 mx-8 rounded-lg transition text-white font-semibold ${
            isLoading || !isCompleted
              ? 'bg-gray-300'
              : 'bg-gray-800 hover:bg-gray-900'
          }`}
          style={{ width: '100px' }}
        >
          {isLoading ? (
            <div className="loader flex flex-row justify-center gap-1">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : stage !== stages[stages.length - 1] ? (
            'Next'
          ) : (
            'Finish'
          )}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
