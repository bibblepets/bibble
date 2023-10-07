import { Request } from 'express';
import mongoose, { Schema, Model } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { ICreateOrUpdateBuyerProfileRequest } from './buyerProfile.model';
import { ICreateOrUpdateBusinessProfileRequest } from './businessProfile.model';


export interface IUser {
  _id: Schema.Types.ObjectId;
  buyerProfile: Schema.Types.ObjectId;
  businessProfile?: Schema.Types.ObjectId | undefined;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  isCorrectPassword(password: string): boolean;
}

export type HydratedDocumentUser = mongoose.HydratedDocument<IUser, IUserMethods>;

interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<HydratedDocumentUser>;
}

export interface ICreateOrUpdateUserRequest extends Request {
  body: Omit<
    IUser,
    '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile' | 'businessProfile'
  > & {
    buyerProfile: ICreateOrUpdateBuyerProfileRequest['body'];
    businessProfile?: ICreateOrUpdateBusinessProfileRequest['body'] | undefined;
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
      cast: '{VALUE} is not a valid buyer profile ID.'
    },
    businessProfile: {
      type: Schema.Types.ObjectId,
      ref: 'BusinessProfile',
      immutable: true,
      required: false,
      cast: '{VALUE} is not a valid business profile ID.',
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
    },
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
    (this as any)._update.password = hashSync((this as any)._update.password, 10);
  }
  next();
});

UserSchema.static('findByEmail', async function (email: string) {
  return await this.findOne({ email });
});

UserSchema.method('isCorrectPassword', function (password: string) {
  return compareSync(password, this.password);
});

const User = mongoose.model<IUser, UserModel>('User', UserSchema);

export default User;

function validateEmail(email: string): boolean {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).test(String(email).toLowerCase());
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}
