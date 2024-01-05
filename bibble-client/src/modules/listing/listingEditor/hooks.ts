import { useParams } from 'react-router-dom';
import BirthdatePreview from './previews/BirthdatePreview';
import DescriptionPreview from './previews/DescriptionPreview';
import GenderPreview from './previews/GenderPreview';
import HairCoatPreview from './previews/HairCoatPreview';
import LicensesPreview from './previews/LicensesPreview';
import MediaPreview from './previews/MediaPreview';
import NamePreview from './previews/NamePreview';
import PricePreview from './previews/PricePreview';
import VaccinationsPreview from './previews/VaccinationsPreview';
import WeightPreview from './previews/WeightPreview';
import Birthdate from './stages/Birthdate';
import Description from './stages/Description';
import Gender from './stages/Gender';
import HairCoat from './stages/HairCoat';
import Licenses from './stages/Licenses';
import Media from './stages/Media';
import Name from './stages/Name';
import Price from './stages/Price';
import Vaccinations from './stages/Vaccinations';
import Weight from './stages/Weight';
import Breeds from './stages/Breeds';
import BreedsPreview from './previews/BreedsPreview';
import OriginPreview from './previews/OriginPreview';
import Origin from './stages/Origin';

type Section = {
  title: string;
  field: string;
  preview?: () => JSX.Element;
};

export const sections: Section[] = [
  {
    title: 'Photo reel',
    field: 'media',
    preview: MediaPreview
  },
  {
    title: 'Name',
    field: 'name',
    preview: NamePreview
  },
  {
    title: 'Price',
    field: 'price',
    preview: PricePreview
  },
  {
    title: 'Breeds',
    field: 'breeds',
    preview: BreedsPreview
  },
  {
    title: 'Origin',
    field: 'origin',
    preview: OriginPreview
  },
  {
    title: 'Description',
    field: 'description',
    preview: DescriptionPreview
  },
  {
    title: 'Gender',
    field: 'gender',
    preview: GenderPreview
  },
  {
    title: 'Birthday',
    field: 'birthdate',
    preview: BirthdatePreview
  },
  {
    title: 'Size & Weight',
    field: 'weight',
    preview: WeightPreview
  },
  {
    title: 'Hair Coat',
    field: 'hairCoat',
    preview: HairCoatPreview
  },
  {
    title: 'Vaccinations',
    field: 'vaccines',
    preview: VaccinationsPreview
  },
  {
    title: 'Licenses',
    field: 'licenses',
    preview: LicensesPreview
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
      case 'price':
        render = Price;
        break;
      case 'breeds':
        render = Breeds;
        break;
      case 'origin':
        render = Origin;
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
