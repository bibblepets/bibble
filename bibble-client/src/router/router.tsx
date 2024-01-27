import { createBrowserRouter } from 'react-router-dom';
import BusinessDashbaord from '../modules/business/BusinessDashbaord';
import BusinessRegister from '../modules/business/BusinessRegister';
import Details from '../modules/kennel/Details';
import Featured from '../modules/kennel/Featured';
import Kennel from '../modules/kennel/Kennel';
import Rescue from '../modules/kennel/Rescue';
import Listing from '../modules/listing/Listing';
import Biography from '../modules/listing/listingCreator/Biography';
import Biology from '../modules/listing/listingCreator/Biology';
import Legal from '../modules/listing/listingCreator/Legal';
import Media from '../modules/listing/listingCreator/Media';
import Medical from '../modules/listing/listingCreator/Medical';
import Price from '../modules/listing/listingCreator/Price';
import Summary from '../modules/listing/listingCreator/Summary';
import ListingEditor from '../modules/listing/listingEditor/ListingEditor';
import Profile from '../modules/profile/Profile';
import {
  kennelLoader,
  listingCreatorLoader,
  listingEditorLoader,
  listingLoader
} from './loaders';

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
            path: 'create/:id/*',
            loader: listingCreatorLoader,
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
          },
          {
            path: 'edit/:id/:stage?',
            loader: listingEditorLoader,
            element: <ListingEditor />
          }
        ]
      },
      {
        path: 'profile',
        element: <Profile />
      }
    ]
  },
  {
    path: 'business',
    children: [
      {
        index: true,
        element: <BusinessDashbaord />
      },
      {
        path: 'register',
        element: <BusinessRegister />
      }
    ]
  }
]);
