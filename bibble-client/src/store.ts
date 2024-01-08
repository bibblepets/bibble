import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/user/userSlice';
import kennelReducer from './features/listing/kennelSlice';
import listingReducer from './features/listing/listingSlice';
import listingOptionsReducer from './features/listing/listingOptionsSlice';
import listingCreatorReducer from './features/listing/listingCreatorSlice';
import listingEditorReducer from './features/listing/listingEditorSlice';
import modalsReducer from './features/modalsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
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
