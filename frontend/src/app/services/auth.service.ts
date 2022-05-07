import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export type User={
  name:string,
  email:string,
  password?:string,
  address:{
    street:string,
    houseNum:string,
    city:string,
    postCode:string,
    country:string,
  }
}

export class AuthService {

  constructor(private http:HttpClient) {

   }

   register(user:User):Observable<string>
   {
      return this.http.post<string>('api/register',user);
   }
}
