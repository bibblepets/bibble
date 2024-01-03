import { Request } from 'express';
import mongoose, { Schema, Model, Document } from 'mongoose';
import { IPopulatedUser, IUser, IUserRequest } from '../user/user.model';
import {
  IAnimal,
  ICreateAnimalRequest,
  IPopulatedAnimal,
  IUpdateAnimalRequest
} from './animal/animal.model';
import { getMediaUrl, listingBucketName } from '../../services/s3.service';
import { IMedia, IPopulatedMedia } from './media.model';

const saleTypes = ['Adoption', 'Sale']; // Add more types here: 'Subscriptions', 'Rentals', etc.
const mediaTypes = ['Image']; // Add more types here: 'video', etc.
const speciesTypes = ['Dog']; // Add other animals here: 'Cat', 'Rabbit', 'Guinea Pig', 'Hamster', 'Gerbil', 'Mouse', 'Chinchilla'
const saleStatuses = ['Available', 'Sold', 'Expired'];

export interface IListing {
  _id: Schema.Types.ObjectId;
  lister: IUser['_id'];
  price: number;
  description: string;
  saleType: string;
  saleStatus: string;
  media: IMedia['_id'][];
  animal: IAnimal['_id'];
  species: string;
  createdAt: Date;
  updatedAt: Date;
  expiryDate: Date;
}

export interface IPopulatedListing {
  _id: Schema.Types.ObjectId;
  lister: IPopulatedUser;
  price: number;
  description: string;
  saleType: string;
  saleStatus: string;
  media: IPopulatedMedia[];
  animal: IPopulatedAnimal;
  species: string;
  createdAt: Date;
  updatedAt: Date;
  expiryDate: Date;
}

interface IListingMethods {
  updateSaleStatus(): void;
  populateMedia(): Promise<IListing>;
  populateAll(): Promise<IPopulatedListing>;
}

export interface ListingModel extends Model<IListing, {}, IListingMethods> {}

export interface ICreateListingRequest extends IUserRequest {
  body: Omit<
    IListing,
    | '_id'
    | 'createdAt'
    | 'updatedAt'
    | 'expiryDate'
    | 'lister'
    | 'animal'
    | 'saleStatus'
  > & {
    listingCreatorId: Schema.Types.ObjectId;
    user: IPopulatedUser;
    animal: ICreateAnimalRequest['body'];
  };
}

export interface IUpdateListingRequest extends IUserRequest {
  params: {
    id: string;
  };
  body: Partial<
    Omit<ICreateListingRequest['body'], 'animal'> & {
      animal: IUpdateAnimalRequest['body'];
    }
  > & {
    user: IPopulatedUser;
  };
}

export interface IUpdateListingMediaRequest extends IUserRequest {
  params: {
    id: string;
  };
  body: {
    user: IPopulatedUser;
    mediaNames: string[];
  };
}

export interface IGetAllListingsRequest extends Request {}

export interface IGetAllListingsBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface IGetListingByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface IGetMyListingsRequest extends IUserRequest {}

export interface IDeleteListingByIdRequest extends IUserRequest {
  params: {
    id: string;
  };
}

const listingSchema = new Schema<IListing, ListingModel, IListingMethods>(
  {
    lister: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'User',
      required: [true, 'Please specify the lister of this listing.']
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price of this listing.'],
      cast: 'Price of `{VALUE}` is invalid.'
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this listing.']
    },
    saleType: {
      type: String,
      enum: {
        values: saleTypes,
        message: 'Sale type of `{VALUE}` is not supported.'
      },
      immutable: true,
      required: [true, 'Please specify the sale type of this listing.']
    },
    saleStatus: {
      type: String,
      enum: {
        values: saleStatuses,
        message: 'Sale status of `{VALUE}` is invalid.'
      },
      default: 'Available'
    },
    media: [
      {
        name: {
          type: String,
          required: [true, 'Please specify the name of this media asset.']
        }
      }
    ],
    animal: {
      type: Schema.Types.ObjectId,
      immutable: true,
      refPath: 'species',
      required: [true, 'Please specify the animal in this listing.']
    },
    species: {
      type: String,
      enum: {
        values: speciesTypes,
        message: 'Animal species of `{VALUE}` is not yet supported.'
      },
      immutable: true,
      required: [
        true,
        'Please specify the species of the animal in this listing.'
      ]
    },
    expiryDate: {
      type: Date,
      immutable: true,
      default: function () {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Set expiration date to 30 days after creation date
        return expiryDate;
      }
    }
  },
  { collection: 'listings', timestamps: true }
);

listingSchema.method('updateSaleStatus', function () {
  if (this.saleStatus === 'Sold' || this.saleStatus === 'Expired') {
    return;
  }

  if (new Date() >= this.expiryDate) {
    this.saleStatus = 'Expired';
  } else {
    this.saleStatus = 'Available';
  }
});

listingSchema.method('populateMedia', async function () {
  const docCopy: IPopulatedListing = this.toObject();

  docCopy.media = await Promise.all(
    docCopy.media.map(async (media) => {
      media.url = await getMediaUrl(media.name, listingBucketName);
      return media;
    })
  );

  return docCopy;
});

listingSchema.method('populateAll', async function () {
  return await this.populate([
    { path: 'lister', populate: { path: 'buyerProfile businessProfile' } },
    { path: 'animal', populate: { path: 'breeds vaccines origin' } }
  ]).then(async (listing) => await listing.populateMedia());
});

listingSchema.pre('save', function (next) {
  this.updateSaleStatus(); // Update sale status based on expiration date

  next();
});

listingSchema.post(
  'findOne',
  async function (
    doc:
      | (Document<unknown, {}, IListing> &
          Omit<
            IListing &
              Required<{
                _id: Schema.Types.ObjectId;
              }>,
            'updateSaleStatus'
          > &
          IListingMethods)
      | null
  ) {
    if (!doc) {
      return;
    }

    await doc.save(); // Trigger update sale status
  }
);

listingSchema.post(
  'find',
  async function (
    docs:
      | (Document<unknown, {}, IListing> &
          Omit<
            IListing &
              Required<{
                _id: Schema.Types.ObjectId;
              }>,
            'updateSaleStatus'
          > &
          IListingMethods)[]
      | null
  ) {
    if (!docs) {
      return;
    }

    docs.forEach(async (doc) => await doc.save()); // Trigger update sale status
  }
);

const Listing = mongoose.model<IListing, ListingModel>(
  'Listing',
  listingSchema
);

module.exports = {
  Listing: Listing,
  saleTypes,
  mediaTypes,
  speciesTypes,
  saleStatuses
};
