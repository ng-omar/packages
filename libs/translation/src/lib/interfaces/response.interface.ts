export interface IResponse<T = void> {
  status: number;
  message: string;
  data: T;
}
