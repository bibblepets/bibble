import ControlHeader from '../../../components/listing/listingEditor/control/ControlHeader';
import SectionList from '../../../components/listing/listingEditor/control/SectionList';

const ListingEditorControl = () => {
  return (
    <section className="hidden lg:flex flex-col pt-12 w-[800px]">
      <ControlHeader />
      <div style={{ height: '50px' }} />
      <SectionList />
    </section>
  );
};

export default ListingEditorControl;
