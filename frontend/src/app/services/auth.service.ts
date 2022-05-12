import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user:User|null=null;

  constructor(private http:HttpClient) {

   }

   register(user:User):Observable<string>
   {
      return this.http.post<string>('api/auth/register',user);
   }

   login(email:string,password:string):Observable<string>
   {
    return this.http.post<string>('api/auth/login',{email,password});
   }

   getUser():Observable<User>
   {
    const userObservable: Observable<User> = this.http.get<User>('/api/auth/logintest');
    userObservable.subscribe({
      next: (val) => {
        this.user = val;
      },
      error: (err) => {
        console.error(err);
      }
    });
    return userObservable;
   }

   logout():Observable<{code:number,message:string}>
   {
     const oberservable:Observable<{code:number,message:string}> = this.http.get<{code:number,message:string}>('/api/auth/logout');
     oberservable.subscribe({
       next: (val) => {
         console.log(val);
         this.user = null;
       },
       error: (err) => console.log(err)
     });
     return oberservable;
   }

   updateUser()
   {

   }
}
