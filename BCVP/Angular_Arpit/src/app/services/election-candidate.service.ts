import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ElectionCandidateService extends DataService {

  constructor(http: HttpClient) {
    super('https://localhost:4000/v1/login-backend', http);
  }

  getData(id:string){
    return this.get(id);
  }
  
  postData(resource, id:string){
    return this.create(resource, id);
  }

  submitVote(candidate){
    return this.create(candidate);
  }
}
