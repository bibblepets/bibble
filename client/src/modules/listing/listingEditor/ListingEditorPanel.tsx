import { useRender } from './hooks';

const ListingEditorPanel = () => {
  const { render: Component } = useRender();
  return (
    <section className="flex flex-row w-full h-full justify-center overflow-auto">
      <Component />
    </section>
  );
};

export default ListingEditorPanel;
