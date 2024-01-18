import mongoose, { Model, Schema } from 'mongoose';
import {
  IListing,
  IListingMethods,
  IListingResponse
} from '../interfaces/listing.interface';
import Breed from '../models/breed.model';
import Country from '../models/country.model';
import HairCoat from '../models/hair-coat.model';
import LegalTag from '../models/legal-tag.model';
import Species from '../models/species.model';
import Vaccine from '../models/vaccine.model';
import * as s3 from '../services/s3';
import { genders, saleTypes, sizes } from '../types/constants';

export interface IListingModel
  extends Model<IListing, unknown, IListingMethods> {}

const ListingSchema = new Schema<IListing, IListingModel, IListingMethods>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      immutable: true,
      required: [true, 'User ID is required']
    },
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
    ],
    originId: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      cast: 'Country ID of `{VALUE}` is invalid'
    },
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
    ],
    legalTagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LegalTag',
        cast: 'Legal tag ID of `{VALUE}` is invalid'
      }
    ],
    saleType: {
      type: String,
      enum: saleTypes,
      immutable: true,
      required: [true, 'Sale type is required']
    },
    name: { type: String },
    gender: { type: String, enum: genders },
    birthdate: { type: Date, case: 'Birthdate of `{VALUE}` is invalid' },
    description: { type: String },
    size: { type: String, enum: sizes },
    weight: { type: Number },
    avsLicenseNumber: { type: String },
    price: {
      type: Number,
      min: [0.0, 'Price must be greater than 0.'],
      cast: 'Price of `{VALUE}` is invalid.'
    },
    media: [
      {
        name: {
          type: String,
          required: [true, 'Please specify the name of this media asset.']
        }
      }
    ]
  },
  { collection: 'listings', timestamps: true, versionKey: false }
);

ListingSchema.method('formatResponse', async function () {
  const docCopy: IListingResponse = this.toObject();

  const species = await Species.findById(docCopy.speciesId);
  const breeds = await Breed.find({ _id: { $in: docCopy.breedIds } });
  const origin = await Country.findById(docCopy.originId);
  const hairCoat = await HairCoat.findById(docCopy.hairCoatId);
  const vaccines = await Vaccine.find({ _id: { $in: docCopy.vaccineIds } });
  const legalTags = await LegalTag.find({ _id: { $in: docCopy.legalTagIds } });

  if (species) docCopy.species = species;
  if (breeds) docCopy.breeds = breeds;
  if (origin) docCopy.origin = origin;
  if (hairCoat) docCopy.hairCoat = hairCoat;
  if (vaccines) docCopy.vaccines = vaccines;
  if (legalTags) docCopy.legalTags = legalTags;

  docCopy.media = await Promise.all(
    docCopy.media.map(async (media) => {
      media.url = await s3.getMediaUrl(media.name, s3.LISTING_BUCKET_NAME);
      return media;
    })
  );

  return docCopy;
});

const Listing = mongoose.model<IListing, IListingModel>(
  'Listing',
  ListingSchema
);

export default Listing;
