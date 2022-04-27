import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NameInfo } from './about.service';

export type AboutList = {list:string[]}

@Injectable({
  providedIn: 'root'
})
export class HenriAboutService {

  constructor(private http: HttpClient) { }

  public getProfileList():Observable<AboutList>
  {
    return this.http.get<AboutList>('/api/profile-list');
  }

  public getProfileInfo(profileName:string):Observable<NameInfo>
  {
    return this.http.get<NameInfo>(`/api/${profileName}`);
  }
}
