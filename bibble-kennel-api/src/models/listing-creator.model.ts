import mongoose, { Model, Schema } from 'mongoose';
import {
  IListingCreator,
  IListingCreatorMethods,
  IListingCreatorResponse
} from '../interfaces/listing-creator.interface';
import { genders, saleTypes, sizes } from '../types/constants';
import * as s3 from '../services/s3';

export interface IListingCreatorModel
  extends Model<IListingCreator, {}, IListingCreatorMethods> {}

const ListingCreatorSchema = new Schema<
  IListingCreator,
  IListingCreatorModel,
  IListingCreatorMethods
>(
  {
    stage: { type: Number, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      immutable: true,
      required: [true, 'User ID is required']
    },
    saleType: {
      type: String,
      enum: saleTypes,
      immutable: true,
      required: [true, 'Sale type is required']
    },
    biology: {
      speciesId: {
        type: Schema.Types.ObjectId,
        ref: 'Species',
        cast: 'Species ID of `{VALUE}` is invalid'
      },
      breedIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Breed',
          cast: 'Breed ID of `{VALUE}` is invalid'
        }
      ]
    },
    biography: {
      originId: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        cast: 'Country ID of `{VALUE}` is invalid'
      },
      name: { type: String },
      gender: { type: String, enum: genders },
      birthdate: { type: Date, case: 'Birthdate of `{VALUE}` is invalid' },
      description: { type: String }
    },
    medical: {
      size: { type: String, enum: sizes },
      weight: { type: Number },
      hairCoatId: {
        type: Schema.Types.ObjectId,
        ref: 'HairCoat',
        cast: 'Hair coat ID of `{VALUE}` is invalid'
      },
      vaccineIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Vaccine',
          cast: 'Vaccine ID of `{VALUE}` is invalid'
        }
      ]
    },
    legal: {
      avsLicenseNumber: { type: String },
      legalTagIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'LegalTag',
          cast: 'Legal tag ID of `{VALUE}` is invalid'
        }
      ]
    },
    media: [
      {
        name: { type: String, required: [true, 'Media name is required'] }
      }
    ],
    price: {
      type: Number,
      min: [0.0, 'Price must be greater than 0.'],
      cast: 'Price of `{VALUE}` is invalid.'
    }
  },
  { collection: 'listing-creators', timestamps: true, versionKey: false }
);

ListingCreatorSchema.method('formatResponse', async function () {
  const docCopy: IListingCreatorResponse = this.toObject();

  if (Array.isArray(docCopy.media)) {
    docCopy.media = await Promise.all(
      docCopy.media.map(async (media) => {
        media.url = await s3.getMediaUrl(media.name, s3.listingBucketName);
        return media;
      })
    );
  }
  return docCopy;
});

const ListingCreator = mongoose.model<IListingCreator, IListingCreatorModel>(
  'ListingCreator',
  ListingCreatorSchema
);

module.exports = ListingCreator;
