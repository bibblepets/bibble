import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/authSlice';
import listingReducer from './features/listingSlice';
import modalsReducer from './features/modalsSlice';

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    listing: listingReducer,
    modals: modalsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
