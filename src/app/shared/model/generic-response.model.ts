export interface GenericResponse<T = any> {
  data: T;
  statusCode: number;
  message: string;
  messageDetails: string[];
}
