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

  get(id) { 
    return this.http.get(this.url + '/' + id)
    .pipe(map(response => response));    
  }

  create(resource) {
    return this.http.post(this.url, JSON.stringify(resource))
    .pipe(map(response => response));
  }

  update(resource) {
    return this.http.patch(this.url + '/' + resource.id, JSON.stringify({ isRead: true }))
    .pipe(map(response => response));
  }

  delete(id) {
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
