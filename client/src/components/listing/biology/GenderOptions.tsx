import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';

const GenderOptions = () => {
  return (
    <div className="flex flex-row gap-8">
      <button
        onClick={() => alert('implement')}
        className="flex flex-row bg-gray-500 px-8 py-4 rounded-lg items-center gap-4"
      >
        <BiMaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Male</a>
      </button>

      <button
        onClick={() => alert('implement')}
        className="flex flex-row bg-gray-500 px-8 py-4 rounded-lg items-center gap-4"
      >
        <BiFemaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Female</a>
      </button>
    </div>
  );
};

export default GenderOptions;
