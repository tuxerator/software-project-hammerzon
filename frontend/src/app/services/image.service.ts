import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IdMessageResponse } from '../components/types';

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {

  }

  public uploadFileImage(file:File,replace_id?:string,is_replaceable?:boolean ):Subject<IdMessageResponse>
  {
    const observable = new Subject<IdMessageResponse>();
    const reader = new FileReader();


    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      if (!event.target || !event.target.result) {
        return;
      }

      const selectedFile = new ImageSnippet(event.target.result.toString(), file);

      this.uploadImage(selectedFile.file, replace_id, is_replaceable).subscribe(observable);
    });

    reader.readAsDataURL(file);

    return observable;
  }

  public uploadImage(image: File,replace_id?:string,is_replaceable?:boolean): Observable<IdMessageResponse> {
    const formData = new FormData();

    formData.append('img', image);
    if(replace_id)
    {
      formData.append('replace_id',replace_id);
    }
    if(is_replaceable)
    {
      formData.append('is_replaceable','true');
    }else{
      formData.append('is_replaceable','false');
    }

    return this.http.post<IdMessageResponse>('api/img/upload', formData);
  }
}
