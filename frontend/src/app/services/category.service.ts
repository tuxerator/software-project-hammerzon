import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IdMessageResponse } from '../components/types';
import { Category } from '../models/Category';

export type CategoryList = {categories:Category[]}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  public addCategory(category:Category):Observable<IdMessageResponse>
  {
    return this.http.post<IdMessageResponse>('api/admin/category/add',category);
  }

  public getCategoriesList(search?:string):Observable<CategoryList>
  {
    if(search)
    {
      return this.http.get<CategoryList>(`api/category/list?search=${search}`);
    }
    return this.http.get<CategoryList>('api/category/list');
  }



}
