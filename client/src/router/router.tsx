import { createBrowserRouter } from 'react-router-dom';
import Details from '../modules/kennel/Details';
import Featured from '../modules/kennel/Featured';
import Kennel from '../modules/kennel/Kennel';
import Rescue from '../modules/kennel/Rescue';
import Biography from '../modules/listing/Biography';
import Biology from '../modules/listing/Biology';
import Legal from '../modules/listing/Legal';
import Listing from '../modules/listing/Listing';
import Media from '../modules/listing/Media';
import Medical from '../modules/listing/Medical';
import Price from '../modules/listing/Price';
import Summary from '../modules/listing/Summary';
import { kennelLoader, listingIdLoader, listingLoader } from './loaders';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: kennelLoader,
    children: [
      {
        index: true,
        element: <Kennel />
      },
      {
        path: 'featured',
        element: <Featured />
      },
      {
        path: 'rescue',
        element: <Rescue />
      },
      {
        path: 'details/:id',
        element: <Details />
      },
      {
        path: 'listing',
        loader: listingLoader,
        children: [
          {
            index: true,
            element: <Listing />
          },
          {
            path: ':id/*',
            loader: listingIdLoader,
            children: [
              {
                path: 'biology',
                element: <Biology />
              },
              {
                path: 'biography',
                element: <Biography />
              },
              {
                path: 'medical',
                element: <Medical />
              },
              {
                path: 'legal',
                element: <Legal />
              },
              {
                path: 'media',
                element: <Media />
              },
              {
                path: 'price',
                element: <Price />
              },
              {
                path: 'summary',
                element: <Summary />
              }
            ]
          }
        ]
      }
    ]
  }
]);
