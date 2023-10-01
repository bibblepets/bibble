import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';

const GenderOptions = () => {
  return (
    <div className="flex flex-row gap-8 justify-between">
      <button
        onClick={() => alert('implement')}
        className="flex flex-row justify-center bg-gray-500 p-4 rounded-lg items-center gap-4 w-full"
      >
        <BiMaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Male</a>
      </button>

      <button
        onClick={() => alert('implement')}
        className="flex flex-row justify-center bg-gray-500 p-4 rounded-lg items-center gap-4 w-full"
      >
        <BiFemaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Female</a>
      </button>
    </div>
  );
};

export default GenderOptions;
