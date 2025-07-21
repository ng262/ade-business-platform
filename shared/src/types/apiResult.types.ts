export type ResultSuccess<T> = {
  success: true;
  data?: T;
};

export type ResultFailure = {
  success: false;
  message: string;
};

export type Result<T> = ResultSuccess<T> | ResultFailure;

export type ClientResult<T> = Result<T>;
export type FetchResult<T> = Result<T>;
