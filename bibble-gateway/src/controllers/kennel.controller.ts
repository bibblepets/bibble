import { NextFunction } from 'express';
import {
  IGetSpeciesRequest,
  IGetSpeciesResponse
} from '../interfaces/kennel/species.interface';
import { Logger } from '../services/logger';
import axios from 'axios';
import { KennelAPIError } from '../errors/api.error';
import {
  IGetBreedsRequest,
  IGetBreedsResponse
} from '../interfaces/kennel/breed.interface';
import { KENNEL_API_URL } from '../resources/servers';
import {
  IGetCountriesRequest,
  IGetCountriesResponse
} from '../interfaces/kennel/country.interface';
import {
  IGetHairCoatsRequest,
  IGetHairCoatsResponse
} from '../interfaces/kennel/hair-coat.interface';
import {
  IGetLegalTagsRequest,
  IGetLegalTagsResponse
} from '../interfaces/kennel/legal-tag.interface';
import {
  IGetVaccinesRequest,
  IGetVaccinesResponse
} from '../interfaces/kennel/vaccine.interface';
import {
  IGetListingByIdRequest,
  IGetListingByIdResponse,
  IGetListingsRequest,
  IGetListingsResponse,
  IGetMyListingsRequest,
  IGetMyListingsResponse,
  IUpdateListingMediaRequest,
  IUpdateListingMediaResponse,
  IUpdateListingRequest,
  IUpdateListingResponse
} from '../interfaces/kennel/listing.interface';
import { ListBucketInventoryConfigurationsOutputFilterSensitiveLog } from '@aws-sdk/client-s3';
import {
  ICreateListingCreatorRequest,
  ICreateListingCreatorResponse,
  ICreateListingRequest,
  ICreateListingResponse,
  IDeleteListingCreatorRequest,
  IDeleteListingCreatorResponse,
  IGetMyListingCreatorsRequest,
  IGetMyListingCreatorsResponse,
  IUpdateBiographyCreatorRequest,
  IUpdateBiologyCreatorRequest,
  IUpdateListingCreatorRequest,
  IUpdateListingCreatorResponse,
  IUpdateMediaCreatorRequest,
  IUpdateMedicalCreatorRequest,
  IUpdatePriceCreatorRequest
} from '../interfaces/kennel/listing-creator.interface';

export const getSpecies = async (
  req: IGetSpeciesRequest,
  res: IGetSpeciesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching species');

    const response = await axios
      .get(`${KENNEL_API_URL}/species`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Species fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getBreeds = async (
  req: IGetBreedsRequest,
  res: IGetBreedsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching breeds');

    const response = await axios
      .get(`${KENNEL_API_URL}/breed`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Breeds fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getCountries = async (
  req: IGetCountriesRequest,
  res: IGetCountriesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching countries');

    const response = await axios
      .get(`${KENNEL_API_URL}/country`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Countries fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getHairCoats = async (
  req: IGetHairCoatsRequest,
  res: IGetHairCoatsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching hair coats');

    const response = await axios
      .get(`${KENNEL_API_URL}/hair-coat`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Hair coats fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getLegalTags = async (
  req: IGetLegalTagsRequest,
  res: IGetLegalTagsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching legal tags');

    const response = await axios
      .get(`${KENNEL_API_URL}/legal-tag`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Legal tags fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getVaccines = async (
  req: IGetVaccinesRequest,
  res: IGetVaccinesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching vaccines');

    const response = await axios
      .get(`${KENNEL_API_URL}/vaccine`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Vaccines fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getListings = async (
  req: IGetListingsRequest,
  res: IGetListingsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching listings');

    const response = await axios
      .get(`${KENNEL_API_URL}/listing`, { params: query })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Listings fetched');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getMyListings = async (
  req: IGetMyListingsRequest,
  res: IGetMyListingsResponse,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    Logger.update('Getting my listings for user', userId);

    const response = await axios
      .get(`${KENNEL_API_URL}/listing/me`, { params: { userId } })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('My listings retrieved');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getListingById = async (
  req: IGetListingByIdRequest,
  res: IGetListingByIdResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Getting listing', _id);

    const response = await axios
      .get(`${KENNEL_API_URL}/listing/${_id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing retrieved');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateListing = async (
  req: IUpdateListingRequest,
  res: IUpdateListingResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateListingMedia = async (
  req: IUpdateListingMediaRequest,
  res: IUpdateListingMediaResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const { mediaNames } = req.body;
  const files = req.files as Express.Multer.File[];
  const blobs = files.map((f) => new Blob([f.buffer], { type: f.mimetype }));

  try {
    Logger.update('Updating listing media', _id);

    const formData = new FormData();
    if (mediaNames) {
      mediaNames.forEach((mediaName) => {
        formData.append('mediaNames[]', mediaName);
      });
    }
    blobs.forEach((blob) => {
      formData.append('data', blob);
    });

    const response = await axios
      .put(`${KENNEL_API_URL}/listing/media/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Listing media updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const createListingCreator = async (
  req: ICreateListingCreatorRequest,
  res: ICreateListingCreatorResponse,
  next: NextFunction
) => {
  const { userId } = req.params;
  const payload = { userId, ...req.body };

  try {
    Logger.update('Creating listing creator');

    const response = await axios
      .post(`${KENNEL_API_URL}/listing-creator`, payload)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Listing creator created');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const createListing = async (
  req: ICreateListingRequest,
  res: ICreateListingResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Creating listing');

    const response = await axios
      .post(`${KENNEL_API_URL}/listing-creator/${_id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Listing created');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getMyListingCreators = async (
  req: IGetMyListingCreatorsRequest,
  res: IGetMyListingCreatorsResponse,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    Logger.update('Getting my listing creators for user', userId);

    const response = await axios
      .get(`${KENNEL_API_URL}/listing-creator/me`, { params: { userId } })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('My listing creators retrieved');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const getListingCreatorById = async (
  req: IGetListingByIdRequest,
  res: IGetListingByIdResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Getting listing creator', _id);

    const response = await axios
      .get(`${KENNEL_API_URL}/listing-creator/${_id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator retrieved');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateListingCreator = async (
  req: IUpdateListingCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateBiologyCreator = async (
  req: IUpdateBiologyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator biology', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/biology/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator biology updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateBiographyCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator biography', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/biography/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator biography updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateMedicalCreator = async (
  req: IUpdateMedicalCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator medical', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/medical/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator medical updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateLegalCreator = async (
  req: IUpdateMedicalCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator legal', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/legal/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator legal updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updateMediaCreator = async (
  req: IUpdateMediaCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const { mediaNames } = req.body;
  const files = req.files as Express.Multer.File[];
  const blobs = files.map((f) => new Blob([f.buffer], { type: f.mimetype }));

  try {
    Logger.update('Updating listing creator media', _id);

    const formData = new FormData();
    if (mediaNames) {
      mediaNames.forEach((mediaName) => {
        formData.append('mediaNames[]', mediaName);
      });
    }
    blobs.forEach((blob) => {
      formData.append('data', blob);
    });

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/media/${_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.success('Listing creator media updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const updatePriceCreator = async (
  req: IUpdatePriceCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator price', _id);

    const response = await axios
      .put(`${KENNEL_API_URL}/listing-creator/price/${_id}`, updates)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator price updated');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};

export const deleteListingCreatorById = async (
  req: IDeleteListingCreatorRequest,
  res: IDeleteListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Deleting listing creator', _id);

    const response = await axios
      .delete(`${KENNEL_API_URL}/listing-creator/${_id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new KennelAPIError(error.response);
      });

    Logger.update('Listing creator deleted');

    return res.status(response.status).json(response.data);
  } catch (error: any) {
    next(error);
  }
};
