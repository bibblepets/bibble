import { configureStore } from '@reduxjs/toolkit';

import businessReducer from './features/business/businessSlice';
import kennelReducer from './features/listing/kennelSlice';
import listingCreatorReducer from './features/listing/listingCreatorSlice';
import listingEditorReducer from './features/listing/listingEditorSlice';
import listingOptionsReducer from './features/listing/listingOptionsSlice';
import listingReducer from './features/listing/listingSlice';
import modalsReducer from './features/modalsSlice';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    business: businessReducer,
    kennel: kennelReducer,
    listing: listingReducer,
    listingOptions: listingOptionsReducer,
    listingCreator: listingCreatorReducer,
    listingEditor: listingEditorReducer,
    modals: modalsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
