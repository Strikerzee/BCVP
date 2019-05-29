import { BadInput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
  constructor(private url: string, private http: HttpClient) { }

  getAll() {
    return this.http.get(this.url)
      .pipe(map(response => response));
  }

  get(id:string) { 
    let token = sessionStorage.getItem('token');
    let user_id = sessionStorage.getItem('user_id');
    return this.http.get(this.url + '/' + id, {
      headers:{
        'Authorization': 'Digest ' + user_id + ':' + token
      }
    })
    .pipe(map(response => response));    
  }

  create(resource:string) {
    return this.http.post(this.url, JSON.stringify(resource), {
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .pipe(map(response => response));
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({ isRead: true }))
    .pipe(map(response => response));
  }

  delete(id:string) {
    return this.http.delete(this.url + '/' + id)
    .pipe(map(response => response))
      .toPromise();
  }

  private handleError(error: Response) {
    if (error.status === 400)
      return Observable.throw(new BadInput(error.json()));
  
    if (error.status === 404)
      return Observable.throw(new NotFoundError());
    
    return Observable.throw(new AppError(error));
  }
}
