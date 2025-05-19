import {httpResource} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable, Observer} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {

  getAdminData(): Observable<string> {
    return new Observable((observer: Observer<any>) => {
      observer.next(httpResource('http://localhost:8080/api/v1/admin').value());
    })
  }
}
