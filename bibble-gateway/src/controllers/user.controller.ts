import axios from 'axios';
import { NextFunction } from 'express';
import { USER_API_URL } from '..';
import { UserAPIError } from '../errors/api.error';
import {
  IAuthUserRequest,
  IAuthUserResponse,
  IGetUserRequest,
  IGetUserResponse,
  ILoginUserRequest,
  ILoginUserResponse,
  ILogoutUserRequest,
  ILogoutUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
  IUpdateUserProfilePictureRequest,
  IUpdateUserProfilePictureResponse,
  IUpdateUserRequest,
  IUpdateUserResponse
} from '../interfaces/user/user.interface';
import * as jwt from '../services/jwt';
import { Logger } from '../services/logger';

export const registerUser = async (
  req: IRegisterUserRequest,
  res: IRegisterUserResponse,
  next: NextFunction
) => {
  try {
    const request = req.body;

    Logger.update('Registering user');

    const response = await axios
      .post(`${USER_API_URL}/auth/register`, request)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    const userId = response.data._id;

    jwt.signAuthToken(req, res, userId);

    Logger.success('User registered', userId);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};

export const loginUser = async (
  req: ILoginUserRequest,
  res: ILoginUserResponse,
  next: NextFunction
) => {
  try {
    const request = req.body;

    Logger.update('Logging in user');

    const response = await axios
      .post(`${USER_API_URL}/auth/login`, request)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    const userId = response.data._id;

    jwt.signAuthToken(req, res, userId);

    Logger.success('User logged in', userId);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};

export const logoutUser = async (
  _req: ILogoutUserRequest,
  res: ILogoutUserResponse,
  next: NextFunction
) => {
  try {
    Logger.update('Logging out user');

    jwt.deleteAuthToken(res);

    Logger.success('User logged out');

    return res.status(200).json('User logged out');
  } catch (error: unknown) {
    next(error);
  }
};

export const authenticateUser = async (
  req: IAuthUserRequest,
  res: IAuthUserResponse,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;

    Logger.update('Authenticating user');

    const response = await axios
      .get(`${USER_API_URL}/auth/${userId}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    Logger.success('User found', response.data._id);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUser = async (
  req: IGetUserRequest,
  res: IGetUserResponse,
  next: NextFunction
) => {
  try {
    const { _id, email } = req.query;

    Logger.update('Getting user');

    const response = await axios
      .get(`${USER_API_URL}/user?_id=${_id}&email=${email}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    Logger.success('User found', response.data.user?._id);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUser = async (
  req: IUpdateUserRequest,
  res: IUpdateUserResponse,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    Logger.update('Updating user');

    const response = await axios
      .put(`${USER_API_URL}/user/${userId}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    Logger.success('User updated', response.data.user?._id);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUserProfilePicture = async (
  req: IUpdateUserProfilePictureRequest,
  res: IUpdateUserProfilePictureResponse,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { profilePic } = req.body;
    const file = req.file as Express.Multer.File;
    const blob = new Blob([file.buffer], { type: file.mimetype });

    Logger.update('Updating user profile picture');

    const formData = new FormData();
    formData.append('profilePic', profilePic);
    formData.append('data', blob, file.originalname);

    const response = await axios
      .put(`${USER_API_URL}/user/profile-picture/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    Logger.success('User profile picture updated', response.data._id);

    return res.status(response.status).json(response.data);
  } catch (error: unknown) {
    next(error);
  }
};
