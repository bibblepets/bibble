import { Navigate, createBrowserRouter } from 'react-router-dom';
import Kennel from './modules/kennel/Kennel';
import ListingDetails from './modules/kennel/ListingDetails';
import Biology from './modules/listing/Biology';
import Legal from './modules/listing/Legal';
import Listing from './modules/listing/Listing';
import Media from './modules/listing/Media';
import Medical from './modules/listing/Medical';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/kennel" />
  },
  {
    path: '/kennel',
    element: <Navigate to="/kennel/explore" />
  },
  {
    path: '/kennel/explore',
    element: <Kennel />
  },
  {
    path: '/listing',
    element: <Listing />
  },
  {
    path: '/listing/biology',
    element: <Biology />
  },
  {
    path: '/listing/biography',
    element: <Biography />
  },
  {
    path: '/listing/medical',
    element: <Medical />
  },
  {
    path: '/listing/legal',
    element: <Legal />
  },
  {
    path: '/listing/media',
    element: <Media />
  },
  {
    path: '/listing/legal',
    element: <Legal />
  },
  {
    path: '/kennel/details',
    element: <ListingDetails />
  }
]);
