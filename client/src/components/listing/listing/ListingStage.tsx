interface ListingStageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ListingStage: React.FC<ListingStageProps> = ({
  title,
  subtitle,
  children
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full overflow-auto my-12">
      <div className="flex flex-col w-full sm:w-[640px] px-8 max-h-full gap-10">
        <div className="flex flex-col gap-2">
          {/* HEADER */}
          <h1 className="font-semibold text-2xl">{title}</h1>
          <p className="font-light text-gray-500">{subtitle}</p>
        </div>
        <hr className="mx-8 bg-sky-300" />

        {/* BODY */}
        {children}
      </div>
    </div>
  );
};

export default ListingStage;
