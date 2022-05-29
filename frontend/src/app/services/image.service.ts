import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdMessageResponse } from '../components/types';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) {

  }

  public uploadImage(image:File):Observable<IdMessageResponse>
  {
    const formData = new FormData();

    formData.append('img', image);

    return this.http.post<IdMessageResponse>('api/img/upload',formData);
  }
}
