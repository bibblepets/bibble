import axios from 'axios';
import { UserAPIError } from '../errors/api.error';
import { IListingResponse } from '../interfaces/kennel/listing.interface';

const USER_API_URL = '';

export const getUserForListing = async (listing: IListingResponse) => {
  const user = await axios
    .get(`${USER_API_URL}/user`, { params: { userId: listing.userId } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new UserAPIError(error.response);
    });

  return { ...listing, user };
};

export const getUserForListings = async (listings: IListingResponse[]) => {
  const formattedListings = await Promise.all(
    listings.map(async (listing) => await getUserForListing(listing))
  );

  return formattedListings;
};
