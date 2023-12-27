import { useParams } from 'react-router-dom';
import Name from './stages/Name';
import Media from './stages/Media';

export const useRender = () => {
  const { stage } = useParams();

  let render = Media;
  if (stage) {
    switch (stage) {
      default:
    }
  }

  return { render };
};
