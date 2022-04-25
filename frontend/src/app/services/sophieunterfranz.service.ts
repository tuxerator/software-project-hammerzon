import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type SophieName = {
  firstName: string,
  lastName: string,
  
};
@Injectable({
  providedIn: 'root'
})
export class SophieunterfranzService {

  constructor(private http: HttpClient) { }
  
  public getSophieName(): Observable <SophieName>{
    return this.http.get<SophieName>('api/sophie-unterfranz');
  }
}
