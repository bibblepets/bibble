import mongoose, { Model, Schema, mongo } from 'mongoose';
import { IUser, IUserMethods } from '../interfaces/user.interface';
import { emailError, validateEmail } from '../validators/email';
import { passwordError, validatePassword } from '../validators/password';
import {
  contactNumberError,
  validateContactNumber
} from '../validators/contactNumber';
import { compareSync, hashSync } from 'bcrypt';

export interface IUserModel extends Model<IUser, {}, IUserMethods> {}

const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validateEmail, emailError]
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      validate: [validatePassword, passwordError]
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
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

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

module.exports = User;
