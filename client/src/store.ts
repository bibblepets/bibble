import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/authSlice';
import kennelReducer from './features/kennelSlice';
import listingOptionsReducer from './features/listingOptionsSlice';
import listingCreatorReducer from './features/listingCreatorSlice';
import modalsReducer from './features/modalsSlice';

export const store = configureStore({
  reducer: {
    authentication: authReducer,
    kennel: kennelReducer,
    listingOptions: listingOptionsReducer,
    listingCreator: listingCreatorReducer,
    modals: modalsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
