import { Request } from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { IPopulatedUser, IUser, IUserRequest } from '../user/user.model';
import { IBreed } from './animal/breed.model';
import { IVaccine } from './animal/vaccine.model';
import { ICountry } from '../country.model';
import { validateAVSLicenseNumber } from './animal/animal.model';

const { saleTypes }: { saleTypes: string[] } = require('./listing.model');
const { genders, sizes }: { genders: string[]; sizes: string[] } = require('./animal/animal.model');
const { hairCoats: dogHairCoats }: { hairCoats: string[] } = require('./animal/dog/dog.model');

export interface IListingCreator {
  _id: Schema.Types.ObjectId;
  stage: number;
  saleType: string;
  lister: IUser['_id'];
  biology?: {
    species?: string;
    breeds?: IBreed['_id'][];
  };
  biography?: {
    origin?: ICountry;
    gender?: string;
    birthdate?: string;
    description?: string;
  };
  medical?: {
    size?: string;
    weight?: number;
    hairCoat?: string;
    vaccines?: IVaccine['_id'][];
  };
  legal?: {
    avsLicenseNumber?: string;
    legalTags?: string[];
  };
  media?: any[]; // TODO TITUS
  price?: number;
}

export interface IPopulatedListingCreator {
  _id: Schema.Types.ObjectId;
  stage: number;
  saleType: string;
  lister: IUser;
  biology?: {
    species?: string;
    breeds?: IBreed[];
  };
  biography?: {
    origin?: ICountry;
    gender?: string;
    birthdate?: string;
    description?: string;
  };
  medical?: {
    size?: string;
    weight?: number;
    hairCoat?: string;
    vaccines?: IVaccine[];
  };
  legal?: {
    avsLicenseNumber?: string;
    legalTags?: string[];
  };
  media?: any[]; // TODO TITUS
  price?: number;
}

export interface ListingCreatorModel extends Model<IListingCreator> {}

export interface ICreateListingCreatorRequest extends IUserRequest {
  body: Pick<IListingCreator, 'saleType' > & {
    user: IPopulatedUser;
    [key: string]: any;
  };
}

export interface IGetMyListingCreatorsRequest extends IUserRequest {}

export interface IUpdateListingCreatorRequest extends IUserRequest {
  params: {
    id: string;
  };
  body: Partial<IListingCreator> & {
    user: IPopulatedUser;
  }
}

export interface IUpdateBiologyRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id' | 'stage'> & {
    user: IPopulatedUser;
    species?: string;
    breeds?: IBreed['_id'][];
    [key: string]: any;
  };
}

export interface IUpdateBiographyRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id' | 'stage'> & {
    user: IPopulatedUser;
    origin?: ICountry['_id'];
    gender?: string;
    birthdate?: string;
    description?: string;
    [key: string]: any;
  };
}

export interface IUpdateMedicalRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id' | 'stage'> & {
    user: IPopulatedUser;
    size?: string;
    weight?: number;
    hairCoat?: string;
    vaccines?: IVaccine['_id'][];
    [key: string]: any;
  };
}

export interface IUpdateLegalRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id' | 'stage'> & {
    user: IPopulatedUser;
    avsLicenseNumber?: string;
    isHypoallergenic?: boolean;
    isMicrochipped?: boolean;
    isNeutered?: boolean;
    isHdbApproved?: boolean;
    [key: string]: any;
  };
}

export interface IUpdateMediaRequest extends IUserRequest {
  body: {
    user: IPopulatedUser;
  }
}

export interface IUpdatePriceRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id' | 'stage'> & {
    user: IPopulatedUser;
    price?: number;
    [key: string]: any;
  };
}

export interface ISubmitListingRequest extends IUserRequest {
  body: Pick<IListingCreator, '_id'> & {
    user: IPopulatedUser;
    [key: string]: any;
  };
}

export interface IDeleteListingCreatorRequest extends IUserRequest {
  params: {
    id: string;
  };
}

const listingCreatorSchema = new Schema(
  {
    stage: {
      type: Number,
      default: 0
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
    lister: {
      type: Schema.Types.ObjectId,
      immutable: true,
      ref: 'User',
      required: [true, 'Please specify the lister of this listing.']
    },
    biology: {
      species: {
        type: String
      },
      breeds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Breed',
          cast: 'Breed ID of `{VALUE}` is invalid.'
        }
      ]
    },
    biography: {
      origin: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        cast: 'Country ID of `{VALUE}` is invalid.'
      },
      gender: {
        type: String,
        enum: {
          values: genders,
          message: 'Gender of `{VALUE}` is neither `Male` nor `Female`.'
        }
      },
      birthdate: {
        type: Date,
        case: 'Birthdate of `{VALUE}` is invalid.'
      },
      description: {
        type: String
      }
    },
    medical: {
      size: {
        type: String,
        enum: {
          values: sizes,
          message: 'Size of `{VALUE}` is neither `Small`, `Medium` nor `Large`.'
        }
      },
      weight: {
        type: Number,
        min: [0.1, 'Weight must be greater than 0.'],
        cast: 'Weight of `{VALUE}` is invalid.'
      },
      hairCoat: {
        type: String,
        enum: {
          values: dogHairCoats,
          message: 'Hair coat of `{VALUE}` is invalid.'
        }
      },
      vaccines: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Vaccine',
          cast: 'Vaccine ID of `{VALUE}` is invalid.',
          required: false
        }
      ]
    },
    legal: {
      avsLicenseNumber: {
        type: String,
        validate: [
          validateAVSLicenseNumber,
          'AVS license number of `{VALUE}` is invalid.'
        ]
      },
      legalTags: {
        type: [String],
        case: 'Legal tags of `{VALUE}` is invalid.'
      }
    },
    media: [],
    price: {
      type: Number,
      min: [0.0, 'Price must be greater than or equal to 0.'],
      cast: 'Price of `{VALUE}` is invalid.'
    }
  },
  { collection: 'listingCreators', timestamps: true }
);

const ListingCreator = mongoose.model<IListingCreator, ListingCreatorModel>(
  'ListingCreator',
  listingCreatorSchema
);

module.exports = {
  ListingCreator
};
