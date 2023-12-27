import ControlHeader from '../../../components/listing/listingEditor/control/ControlHeader';
import SectionList from '../../../components/listing/listingEditor/control/SectionList';

const ListingEditorControl = () => {
  return (
    <section className="hidden lg:block flex flex-col h-full w-[840px] pl-32 pr-12 py-12">
      <ControlHeader />
      <div style={{ height: '50px' }} />
      <SectionList />
    </section>
  );
};

export default ListingEditorControl;
