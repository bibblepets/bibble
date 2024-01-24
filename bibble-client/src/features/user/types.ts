import { Address, Media } from '../types';

export type AccountType = 'user' | 'business' | undefined;

export type User = {
  _id?: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  address?: Address;
  profilePic?: Media;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
