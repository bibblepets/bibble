import axios from 'axios';
import { IListingResponse } from '../interfaces/kennel/listing.interface';
import { USER_API_URL } from '../resources/servers';
import { UserAPIError } from '../errors/api.error';

export const getUserForListing = async (listing: IListingResponse) => {
  const user = await axios
    .get(`${USER_API_URL}/user`, { params: { _id: listing.userId } })
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
