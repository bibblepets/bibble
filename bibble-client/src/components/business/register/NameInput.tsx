import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

const NameInput: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <Input
      label="Business Name"
      description="What's the name of your business?"
    >
      <input
        className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        type="text"
        placeholder="Business name"
        value={value}
        onChange={onChange}
      />
    </Input>
  );
};

export default NameInput;
