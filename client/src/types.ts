export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StatusType = 'DEFAULT' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type ModalType = {
  isOpen: boolean;
};
