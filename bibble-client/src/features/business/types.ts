import { Address, Media } from '../types';

export type Business = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: Address;
  media: Media[];
  description: string;
  instagramLink?: string;
  facebookLink?: string;
  websiteLink?: string;

  listingIds: string[];
  reviewIds: string[];
  rating: number;
  ratingCount: number;
  licenseNumber: string;

  createdAt?: Date;
  updatedAt?: Date;
};
