import { useParams } from 'react-router-dom';
import Name from './stages/Name';
import Media from './stages/Media';
import Description from './stages/Description';
import Gender from './stages/Gender';

export const useRender = () => {
  const { stage } = useParams();

  let render = Media;
  if (stage) {
    switch (stage) {
      case 'photos':
        render = Media;
        break;
      case 'name':
        render = Name;
        break;
      case 'description':
        render = Description;
        break;
      case 'gender':
        render = Gender;
        break;
      default:
    }
  }

  return { render };
};
