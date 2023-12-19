import { useCallback } from 'react';
import { ListingStage } from '../../../types';
import { NavigateFunction } from 'react-router-dom';
import { store } from '../../../store';
import {
  createListing,
  updateBiography,
  updateBiology,
  updateLegal,
  updateMedia,
  updateMedical,
  updatePrice
} from '../../../features/listingCreatorSlice';
import { AsyncThunk } from '@reduxjs/toolkit';

export const useProgress = (
  navigate: NavigateFunction,
  stage: ListingStage,
  listingId: string
) => {
  let back = '';
  let next = '';
  let update: AsyncThunk<any, void, {}>;

  switch (stage) {
    case 'Biology':
      back = '';
      next = 'Biography';
      update = updateBiology;
      break;
    case 'Biography':
      back = 'Biology';
      next = 'Medical';
      update = updateBiography;
      break;
    case 'Medical':
      back = 'Biography';
      next = 'Legal';
      update = updateMedical;
      break;
    case 'Legal':
      back = 'Medical';
      next = 'Media';
      update = updateLegal;
      break;
    case 'Media':
      back = 'Legal';
      next = 'Price';
      update = updateMedia;
      break;
    case 'Price':
      back = 'Media';
      next = 'Summary';
      update = updatePrice;
      break;
    case 'Summary':
      back = 'Price';
      next = '';
      update = createListing;
    default:
      break;
  }

  const onBack = useCallback(() => {
    if (back === '') {
      navigate('/listing');
    } else {
      navigate(`/listing/${listingId}/${back}`);
    }
  }, [navigate]);

  const onNext = useCallback(async () => {
    if (update) {
      const action = await store.dispatch(update());

      if (update.fulfilled.match(action)) {
        if (next === '') {
          navigate('/listing');
        } else {
          navigate(`/listing/${listingId}/${next}`);
        }
      } else if (update.rejected.match(action)) {
        // Don't navigate
      }
    }
  }, []);

  return { onBack, onNext };
};
