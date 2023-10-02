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
  status: StatusType;
};

export type RegisterModalType = ModalType & {
  name: string;
  email: string;
  password: string;
};

export type LoginModalType = ModalType & {
  email: string;
  password: string;
};
