export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StatusType = 'DEFAULT' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type RejectedAction = {
  payload?: any;
  error: {
    message: string;
    name: string;
    stack?: string;
  };
  meta: {
    arg: { email: string; password: string };
    requestId: string;
    rejectedWithValue: boolean;
    aborted: boolean;
    condition: boolean;
  };
  type: string;
};
