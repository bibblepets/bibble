import mongoose, { Model, Schema } from 'mongoose';
import {
  IListing,
  IListingMethods,
  IListingResponse
} from '../interfaces/listing.interface';
import { genders, saleTypes, sizes } from '../types/constants';
import { ISpeciesModel } from './species.model';
import { IBreedModel } from './breed.model';
import { ICountryModel } from './country.model';
import { IHairCoatModel } from './hair-coat.model';
import { IVaccineModel } from './vaccine.model';
import { ILegalTagModel } from './legal-tag.model';
import * as s3 from '../services/s3';

const Species: ISpeciesModel = require('../models/species.model');
const Breed: IBreedModel = require('../models/breed.model');
const Country: ICountryModel = require('../models/country.model');
const HairCoat: IHairCoatModel = require('../models/hair-coat.model');
const Vaccine: IVaccineModel = require('../models/vaccine.model');
const LegalTag: ILegalTagModel = require('../models/legal-tag.model');

export interface IListingModel extends Model<IListing, {}, IListingMethods> {}

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
      media.url = await s3.getMediaUrl(media.name, s3.listingBucketName);
      return media;
    })
  );

  return docCopy;
});

const Listing = mongoose.model<IListing, IListingModel>(
  'Listing',
  ListingSchema
);

module.exports = Listing;
