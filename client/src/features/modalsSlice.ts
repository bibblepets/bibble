import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LoginModalType, RegisterModalType } from '../types';

interface ModalsState {
  registerModal: RegisterModalType;
  loginModal: LoginModalType;
}

const initialState: ModalsState = {
  registerModal: {
    isOpen: false,
    status: 'DEFAULT',
    name: '',
    email: '',
    password: ''
  },
  loginModal: {
    isOpen: false,
    status: 'DEFAULT',
    email: '',
    password: ''
  }
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openRegisterModal: (state) => {
      state.registerModal.isOpen = true;
    },
    closeRegisterModal: (state) => {
      state.registerModal.isOpen = false;
    },
    updateRegisterModalName: (state, action: PayloadAction<string>) => {
      state.registerModal.name = action.payload;
    },
    updateRegisterModalEmail: (state, action: PayloadAction<string>) => {
      state.registerModal.email = action.payload;
    },
    updateRegisterModalPassword: (state, action: PayloadAction<string>) => {
      state.registerModal.password = action.payload;
    },
    resetRegisterModal: (state) => {
      state.registerModal = initialState.registerModal;
    },
    openLoginModal: (state) => {
      state.loginModal.isOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModal.isOpen = false;
    },
    updateLoginModalEmail: (state, action: PayloadAction<string>) => {
      state.loginModal.email = action.payload;
    },
    updateLoginModalPassword: (state, action: PayloadAction<string>) => {
      state.loginModal.password = action.payload;
    },
    resetLoginModal: (state) => {
      state.loginModal = initialState.loginModal;
    }
  }
});

export const {
  openRegisterModal,
  closeRegisterModal,
  updateRegisterModalName,
  updateRegisterModalEmail,
  updateRegisterModalPassword,
  resetRegisterModal,
  openLoginModal,
  closeLoginModal,
  updateLoginModalEmail,
  updateLoginModalPassword,
  resetLoginModal
} = modalsSlice.actions;

export const selectIsRegisterModalOpen = (state: RootState) =>
  state.modals.registerModal.isOpen;
export const selectRegisterModalStatus = (state: RootState) =>
  state.modals.registerModal.status;
export const selectRegisterModalName = (state: RootState) =>
  state.modals.registerModal.name;
export const selectRegisterModalEmail = (state: RootState) =>
  state.modals.registerModal.email;
export const selectRegisterModalPassword = (state: RootState) =>
  state.modals.registerModal.password;
export const selectIsLoginModalOpen = (state: RootState) =>
  state.modals.loginModal.isOpen;
export const selectLoginModalStatus = (state: RootState) =>
  state.modals.loginModal.status;
export const selectLoginModalEmail = (state: RootState) =>
  state.modals.loginModal.email;
export const selectLoginModalPassword = (state: RootState) =>
  state.modals.loginModal.password;

export default modalsSlice.reducer;
