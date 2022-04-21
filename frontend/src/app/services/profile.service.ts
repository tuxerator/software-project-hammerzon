import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NameInfo } from './about.service';

export type ProfileList = {list:string[]}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public getProfileList():Observable<ProfileList>
  {
    return this.http.get<ProfileList>('/api/profile-list');
  }

  public getProfileInfo(profileName:string):Observable<NameInfo>
  {
    return this.http.get<NameInfo>(`/api/${profileName}`);
  }
}
