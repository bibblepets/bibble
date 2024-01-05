import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import kennelReducer from './features/kennelSlice';
import listingReducer from './features/listingSlice';
import listingOptionsReducer from './features/listingOptionsSlice';
import listingCreatorReducer from './features/listingCreatorSlice';
import listingEditorReducer from './features/listingEditorSlice';
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
