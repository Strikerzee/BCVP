import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SendLoginDataService extends DataService {

  constructor(http: HttpClient) {
    super('/api/v1/login-backend', http);
  }

  sendData(credentials) {
    return this.create(credentials);
  }
}