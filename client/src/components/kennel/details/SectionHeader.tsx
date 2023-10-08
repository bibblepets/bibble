const SectionHeader = ({
  title,
  IconComponent
}: {
  title: string;
  IconComponent: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) => {
  return (
    <div className="flex items-center gap-4 text-gray-800">
      <IconComponent className="w-6 h-6" />
      {` ${title}`}
      <hr className="grow mx-2" />
    </div>
  );
};

export default SectionHeader;
