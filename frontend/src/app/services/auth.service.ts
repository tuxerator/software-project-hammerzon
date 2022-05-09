import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) {

   }

   register(user:User):Observable<string>
   {
      return this.http.post<string>('api/auth/register',user);
   }
}
