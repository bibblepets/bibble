import { Navigate, createBrowserRouter } from 'react-router-dom';
import Kennel from './modules/kennel/Kennel';
import Biology from './modules/listing/Biology';
import Geography from './modules/listing/Geography';
import Legal from './modules/listing/Legal';
import Listing from './modules/listing/Listing';
import Media from './modules/listing/Media';
import Medical from './modules/listing/Medical';
import SaleType from './modules/listing/SaleType';

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
    path: '/listing/sale-type',
    element: <SaleType />
  },
  {
    path: '/listing/biology',
    element: <Biology />
  },
  {
    path: '/listing/geography',
    element: <Geography />
  },
  {
    path: '/listing/medical',
    element: <Medical />
  },
  {
    path: '/listing/media',
    element: <Media />
  },
  {
    path: '/listing/legal',
    element: <Legal />
  }
]);
