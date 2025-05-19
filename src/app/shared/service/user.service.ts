import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UserService {

  public static readonly Endpoint =  {
    GET_USER_DATA: "/",
  }

  public static readonly BASE_URL: string = environment.apiUrl + "/api/v1/user";
}
