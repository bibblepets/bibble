import { useParams } from 'react-router-dom';
import ListingEditorLayout from '../../../layouts/ListingEditorLayout';
import ListingEditorControl from './ListingEditorControl';
import ListingEditorPanel from './ListingEditorPanel';

const ListingEditor = () => {
  const { stage } = useParams();

  return (
    <ListingEditorLayout>
      <ListingEditorControl />
      {stage && (
        <>
          <a className="hidden lg:block border-l h-full mr-2" />
          <ListingEditorPanel />
        </>
      )}
    </ListingEditorLayout>
  );
};

export default ListingEditor;
