import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdMessageResponse } from '../components/types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {

  }

  public uploadImage(image: File,replace_id?:string): Observable<IdMessageResponse> {
    const formData = new FormData();

    formData.append('img', image);
    if(replace_id)
    {
      formData.append('replace_id',replace_id)
    }

    return this.http.post<IdMessageResponse>('api/img/upload', formData);
  }
}
