import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export type CedricInfo = {
    firstName: string,
    lastName: string,
    optionalAttribut?: string
}

@Injectable({
    providedIn: 'root'
})
export class CedricwieseService {

    
    constructor(private http: HttpClient) { }

    public getCedricInfo(): Observable<CedricInfo> {
       
        return this.http.get<CedricInfo>('/api/cedric-wiese');
    }
}
