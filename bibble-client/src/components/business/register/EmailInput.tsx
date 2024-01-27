import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

const EmailInput: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <Input label="Email" description="Your corporate email address">
      <input
        className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        type="text"
        placeholder="Email"
        value={value}
        onChange={onChange}
      />
    </Input>
  );
};

export default EmailInput;
