import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type NameInfo = {
  firstName: string,
  lastName: string,
  optionalAttribut?: string
}

@Injectable({
  providedIn: 'root'
})
export class AboutMeService {

  constructor(private http: HttpClient) {
  }

  /**
   * Returns the NameInfo of nameID from the api.
   * @param nameID Name of the Person in the form '[firstName]-[lastName]'
   */
  public getNameInfo(nameID: string): Observable<NameInfo> {
    return this.http.get<NameInfo>(`/api/about/${ nameID }`);
  }
}
