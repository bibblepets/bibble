import { IconType } from 'react-icons';
import { toCamelCase } from '../../../utils/string';

interface SpeciesBoxProps {
  type: string;
  icon: IconType;
}

const SpeciesBox: React.FC<SpeciesBoxProps> = ({ type, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-4 rounded-lg bg-gray-500">
        <Icon className="text-white w-6 h-6" />
      </div>
      <a className="text-sm font-light text-gray-500">{toCamelCase(type)}</a>
    </div>
  );
};

export default SpeciesBox;
