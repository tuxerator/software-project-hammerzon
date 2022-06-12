import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription, Observer, take, subscribeOn, SubjectLike, Unsubscribable } from 'rxjs';
import { IdMessageResponse } from '../components/types';

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

class FakeObservable<T> implements SubjectLike<T> {
  obs:Partial<Observer<T>>[];

  constructor(){
    this.obs = [];
  }

  public subscribe( observer:Partial<Observer<T>>):Unsubscribable// Partial<Observer<T>> | undefined): Subscription)
  {
    this.obs.push(observer);
    return {
      unsubscribe : ()  => {
          this.obs.filter(o => o !== observer);
      },
    };
  }

  public next(val:T):void{
    this.obs.forEach(ob => ob.next?.call(ob,val));
  }
  public error(err: any):void{
    this.obs.forEach(ob => ob.error?.call(ob,err));
  }

  public complete(): void
  {
    this.obs.forEach(ob => ob.complete?.call(ob));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {

  }



  public uploadFileImage(file:File,replace_id?:string,is_replaceable?:boolean ):SubjectLike<IdMessageResponse>
  {
    const observable = new FakeObservable<IdMessageResponse>();
    const reader = new FileReader();


    reader.addEventListener('load', (event: any) => {

      const selectedFile = new ImageSnippet(event.target.result, file);

      this.uploadImage(selectedFile.file,replace_id,is_replaceable).subscribe(observable);
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
