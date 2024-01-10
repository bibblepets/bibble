import axios from 'axios';
import dotenv from 'dotenv';
import { KeyNotFoundError } from '../errors/key.error';

dotenv.config();

const bibbleUserApiUrl = process.env.BIBBLE_USER_API_URL;

export const getUserById = async (userId: string) => {
  const user = await axios
    .get(`${bibbleUserApiUrl}/user?_id=${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((_error) => {
      throw new KeyNotFoundError('Invalid user ID', 'userId', userId);
    });

  return user;
};
