import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt';
import {
  IBuyerProfile,
  ICreateBuyerProfileRequest,
  IPopulatedBuyerProfile,
  IUpdateBuyerProfileRequest
} from './buyer-profile.model';
import {
  IBusinessProfile,
  ICreateBusinessProfileRequest,
  IPopulatedBusinessProfile,
  IUpdateBusinessProfileRequest
} from './business-profile.model';
import { getMediaUrl, userBucketName } from '../../services/s3.service';

export interface IUser {
  _id: Schema.Types.ObjectId;
  buyerProfile: IBuyerProfile['_id'];
  businessProfile: IBusinessProfile['_id'];
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedUser
  extends Omit<IUser, 'buyerProfile' | 'businessProfile'> {
  buyerProfile: IPopulatedBuyerProfile;
  businessProfile: IPopulatedBusinessProfile;
}

interface IUserMethods {
  isCorrectPassword(password: string): boolean;
  populateProfilePic(): Promise<IBuyerProfile>;
  populateAll(): Promise<IPopulatedUser>;
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {}

export interface IUserRequest extends Request {
  body: {
    user: IPopulatedUser;
  };
}

export interface IGetUserRequest extends IUserRequest {}

export interface IRegisterUserRequest extends Request {
  body: Omit<
    IUser,
    '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile' | 'businessProfile'
  > & {
    buyerProfile: ICreateBuyerProfileRequest['body'];
    businessProfile?: ICreateBusinessProfileRequest['body'];
  };
}

export interface IUpdateUserRequest extends IUserRequest {
  body: Partial<
    Omit<IRegisterUserRequest['body'], 'buyerProfile' | 'businessProfile'> & {
      buyerProfile: IUpdateBuyerProfileRequest['body'];
      businessProfile: IUpdateBusinessProfileRequest['body'];
    }
  > & {
    user: IPopulatedUser;
  };
}

export interface IUpdateProfilePictureRequest extends IUserRequest {
  body: {
    user: IPopulatedUser;
    profilePic: string;
  };
}

export interface ICheckAuthStatusRequest extends Request {
  cookies: {
    authToken: string;
  };
}

export interface ILoginUserRequest extends Request {
  body: Omit<
    IUser,
    '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile' | 'businessProfile'
  >;
}

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    buyerProfile: {
      type: Schema.Types.ObjectId,
      ref: 'BuyerProfile',
      immutable: true,
      required: [true, 'Please provide a buyer profile for this user.'],
      cast: 'Buyer Profile ID of `{VALUE}` is invalid.'
    },
    businessProfile: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessProfile',
      immutable: true,
      required: false,
      cast: 'Business Profile ID of `{VALUE}` is invalid.'
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Please provide an email.'],
      validate: [validateEmail, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      validate: [
        validatePassword,
        'Password must be at least 6 characters long.'
      ]
    }
  },
  { collection: 'users', timestamps: true, versionKey: false }
);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  if ((this as any)._update.password) {
    (this as any)._update.password = hashSync(
      (this as any)._update.password,
      10
    );
  }
  next();
});

UserSchema.method('isCorrectPassword', function (password: string) {
  return compareSync(password, this.password);
});

UserSchema.method('populateProfilePic', async function () {
  const docCopy: IPopulatedUser = this.toObject();

  if (docCopy.buyerProfile && docCopy.buyerProfile.profilePic) {
    docCopy.buyerProfile.profilePic.url = await getMediaUrl(
      docCopy.buyerProfile.profilePic.name,
      userBucketName
    );
  }

  return docCopy;
});

UserSchema.method('populateAll', async function () {
  return await this.populate([
    { path: 'buyerProfile', populate: { path: 'favouriteListings' } },
    { path: 'businessProfile' }
  ]).then(async (user) => await user.populateProfilePic());
});

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

module.exports = User;

function validateEmail(email: string): boolean {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).test(String(email).toLowerCase());
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}
