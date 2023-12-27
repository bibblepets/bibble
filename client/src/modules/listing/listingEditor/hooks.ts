import { useParams } from 'react-router-dom';
import Name from './stages/Name';
import Media from './stages/Media';
import Description from './stages/Description';
import Gender from './stages/Gender';
import Birthdate from './stages/Birthdate';
import Weight from './stages/Weight';
import HairCoat from './stages/HairCoat';
import DefaultPreview from './previews/DefaultPreview';
import Vaccinations from './stages/Vaccinations';
import Licenses from './stages/Licenses';

type Section = {
  title: string;
  field: string;
  preview?: () => JSX.Element;
};

export const sections: Section[] = [
  {
    title: 'Photo reel',
    field: 'media',
    preview: DefaultPreview
  },
  {
    title: 'Name',
    field: 'name',
    preview: DefaultPreview
  },
  {
    title: 'Description',
    field: 'description',
    preview: DefaultPreview
  },
  {
    title: 'Gender',
    field: 'gender',
    preview: DefaultPreview
  },
  {
    title: 'Birthday',
    field: 'birthdate',
    preview: DefaultPreview
  },
  {
    title: 'Size & Weight',
    field: 'weight',
    preview: DefaultPreview
  },
  {
    title: 'Hair Coat',
    field: 'hairCoat',
    preview: DefaultPreview
  },
  {
    title: 'Vaccinations',
    field: 'vaccines',
    preview: DefaultPreview
  },
  {
    title: 'Licenses',
    field: 'licenses',
    preview: DefaultPreview
  }
];

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
      case 'birthdate':
        render = Birthdate;
        break;
      case 'weight':
        render = Weight;
        break;
      case 'hairCoat':
        render = HairCoat;
        break;
      case 'vaccines':
        render = Vaccinations;
        break;
      case 'licenses':
        render = Licenses;
        break;
      default:
    }
  }

  return { render };
};
