import ListingEditorLayout from '../../../layouts/ListingEditorLayout';
import ListingEditorControl from './ListingEditorControl';
import ListingEditorPanel from './ListingEditorPanel';

const ListingEditor = () => {
  return (
    <ListingEditorLayout>
      <ListingEditorControl />
      <a className="border-l h-full mx-2" />
      <ListingEditorPanel />
    </ListingEditorLayout>
  );
};

export default ListingEditor;
