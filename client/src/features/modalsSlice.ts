import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ModalType } from '../types';

interface ModalsState {
  registerModal: ModalType;
  loginModal: ModalType;
}

const initialState: ModalsState = {
  registerModal: { isOpen: false },
  loginModal: { isOpen: false }
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
    openLoginModal: (state) => {
      state.loginModal.isOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModal.isOpen = false;
    }
  }
});

export const {
  openRegisterModal,
  closeRegisterModal,
  openLoginModal,
  closeLoginModal
} = modalsSlice.actions;

export const selectIsRegisterModalOpen = (state: RootState) =>
  state.modals.registerModal.isOpen;
export const selectIsLoginModalOpen = (state: RootState) =>
  state.modals.loginModal.isOpen;

export default modalsSlice.reducer;
