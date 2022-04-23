import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type LukasName = {
  name : string
}

@Injectable({
  providedIn: 'root'
})

export class LukasErneService {

  constructor(private http: HttpClient) { }

  public getLukasName(): Observable<LukasName> {
    
    return this.http.get<LukasName>('api/lukas-erne');

  }
}
