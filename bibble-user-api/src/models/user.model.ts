import { compareSync, hashSync } from 'bcrypt';
import mongoose, { Model, Schema } from 'mongoose';
import {
  IUser,
  IUserMethods,
  IUserResponse
} from '../interfaces/user.interface';
import * as s3 from '../services/s3';
import {
  contactNumberError,
  validateContactNumber
} from '../validators/contactNumber';
import { emailError, validateEmail } from '../validators/email';
import { nameError, validateName } from '../validators/name';
import { passwordError, validatePassword } from '../validators/password';

export interface IUserModel extends Model<IUser, object, IUserMethods> {}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validateEmail, emailError]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: [validatePassword, passwordError]
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
      validate: [validateName, nameError]
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
      validate: [validateName, nameError]
    },
    contactNumber: {
      type: String,
      trim: true,
      validate: [validateContactNumber, contactNumberError]
    },
    address: {
      country: {
        type: String,
        trim: true
      },
      streetAddress: {
        type: String,
        trim: true
      },
      unit: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      postcode: {
        type: String,
        trim: true
      }
    },
    profilePic: {
      name: {
        type: String
      }
    },
    bio: {
      type: String,
      trim: true
    }
  },
  {
    collection: 'users',
    timestamps: true,
    versionKey: false
  }
);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

UserSchema.pre(
  'findOneAndUpdate',
  function (this: { _update: { password?: string } }, next) {
    if (this._update.password) {
      this._update.password = hashSync(this._update.password, 10);
    }

    next();
  }
);

UserSchema.method('isCorrectPassword', function (password: string) {
  return compareSync(password, this.password);
});

UserSchema.method('formatResponse', async function () {
  const docCopy: IUserResponse = this.toObject();
  delete docCopy.password;

  if (docCopy.profilePic) {
    docCopy.profilePic.url = await s3.getMediaUrl(
      docCopy.profilePic.name,
      s3.USER_BUCKET_NAME
    );
  }

  return docCopy;
});

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
