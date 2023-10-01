interface ListingSectionProps {
  title: string;
  children: React.ReactNode;
}

const ListingSection: React.FC<ListingSectionProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-medium text-lg">{title}</h2>
      {children}
    </div>
  );
};

export default ListingSection;
