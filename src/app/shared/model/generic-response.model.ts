export interface GenericResponseModel<T = any> {
  data: T;
  statusCode: number;
  message: string;
  messageDetails: string[];
}
