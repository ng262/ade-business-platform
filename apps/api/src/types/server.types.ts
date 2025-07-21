export type ServiceSuccess<T> = {
  success: true;
  status: number;
  data?: T;
  message: string;
};

export type ServiceFail = {
  success: false;
  status: number;
  message: string;
  errors: any;
};

export type ServiceResponse<T> = ServiceSuccess<T> | ServiceFail;
