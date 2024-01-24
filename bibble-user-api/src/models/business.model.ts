import { compareSync, hashSync } from 'bcrypt';
import mongoose, { Model, Schema } from 'mongoose';
import {
  IBusiness,
  IBusinessMethods,
  IBusinessResponse
} from '../interfaces/business.interface';
import * as s3 from '../services/s3';
import {
  contactNumberError,
  validateContactNumber
} from '../validators/contactNumber';
import { emailError, validateEmail } from '../validators/email';
import { nameError, validateName } from '../validators/name';
import { passwordError, validatePassword } from '../validators/password';

export interface IBusinessModel
  extends Model<IBusiness, object, IBusinessMethods> {}

const BusinessSchema = new Schema<IBusiness, IBusinessModel, IBusinessMethods>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      validate: [validateName, nameError]
    },
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
    contactNumber: {
      type: String,
      trim: true,
      validate: [validateContactNumber, contactNumberError]
    },
    address: {
      type: {
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
      required: [true, 'Address is required']
    },
    opensAt: {
      type: Date,
      required: [true, 'Opening time is required']
    },
    closesAt: {
      type: Date,
      required: [true, 'Closing time is required']
    },
    media: [
      {
        name: {
          type: String
        }
      }
    ],
    description: {
      type: String,
      trim: true
    },
    instagramLink: {
      type: String,
      trim: true
    },
    facebookLink: {
      type: String,
      trim: true
    },
    websiteLink: {
      type: String,
      trim: true
    },
    listingIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Listing'
      }
    ],
    reviewIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 3
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    licenseNumber: {
      type: String,
      trim: true
    }
  },
  {
    collection: 'businesses',
    timestamps: true,
    versionKey: false
  }
);

BusinessSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hashSync(this.password, 10);
  }

  next();
});

BusinessSchema.pre(
  'findOneAndUpdate',
  function (this: { _update: { password?: string } }, next) {
    if (this._update.password) {
      this._update.password = hashSync(this._update.password, 10);
    }

    next();
  }
);

BusinessSchema.method('isCorrectPassword', function (password: string) {
  return compareSync(password, this.password);
});

BusinessSchema.method('formatResponse', async function () {
  const docCopy: IBusinessResponse = this.toObject();
  delete docCopy.password;

  docCopy.media = await Promise.all(
    docCopy.media.map(async (media) => {
      media.url = await s3.getMediaUrl(media.name, s3.BUSINESS_BUCKET_NAME);
      return media;
    })
  );

  return docCopy;
});

const User = mongoose.model<IBusiness, IBusinessModel>(
  'Business',
  BusinessSchema
);

export default User;
