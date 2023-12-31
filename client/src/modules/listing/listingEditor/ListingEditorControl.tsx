import { useParams } from 'react-router-dom';
import ControlHeader from '../../../components/listing/listingEditor/control/ControlHeader';
import SectionList from '../../../components/listing/listingEditor/control/SectionList';

const ListingEditorControl = () => {
  const { stage } = useParams();

  return (
    <section
      className={`${
        !stage ? 'flex w-full' : 'hidden lg:flex w-[800px]'
      } flex-col pt-12`}
    >
      <ControlHeader />
      <div style={{ height: '50px' }} />
      <SectionList />
    </section>
  );
};

export default ListingEditorControl;
