import ListingEditorLayout from '../../../layouts/ListingEditorLayout';
import ListingEditorControl from './ListingEditorControl';
import ListingEditorPanel from './ListingEditorPanel';

const ListingEditor = () => {
  return (
    <ListingEditorLayout>
      <ListingEditorControl />
      <a className="hidden lg:block border-l h-full mr-2" />
      <ListingEditorPanel />
    </ListingEditorLayout>
  );
};

export default ListingEditor;
