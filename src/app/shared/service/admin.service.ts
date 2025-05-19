import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  static readonly Endpoint =  {
    GET_ADMIN_DATA: "",
  }

  private BASE_URL: string = environment.apiUrl + "/api/v1/admin";
}
