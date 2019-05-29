import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectionCandidateService {

  constructor(private http: HttpClient) {

  }

  getData(url: string){
    let token = localStorage.getItem('token');
    if(token)
      return this.http.get(url, {
        headers:{
          authorization: 'Digest ' + token,
          credentials: 'include'
        }
      })
    else{
      return new Observable((subscriber)=>{
        subscriber.next();
        subscriber.complete();
      })
    }
  }
}
