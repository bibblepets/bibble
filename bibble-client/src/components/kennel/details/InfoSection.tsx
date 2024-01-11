import { IconType } from 'react-icons';

const InfoSection = ({
  string,
  IconComponent
}: {
  string?: string;
  IconComponent:
    | IconType
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
          title?: string | undefined;
          titleId?: string | undefined;
        } & React.RefAttributes<SVGSVGElement>
      >;
}) => {
  if (!string) return null;

  return (
    <div className="flex items-center gap-4 pl-1 text-gray-800 font-light">
      <IconComponent className="w-5 h-5" />
      {`${string}`}
    </div>
  );
};

export default InfoSection;
