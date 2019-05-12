import { TestBed } from '@angular/core/testing';

import { SendLoginDataService } from './send-login-data.service';

describe('SendLoginDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendLoginDataService = TestBed.get(SendLoginDataService);
    expect(service).toBeTruthy();
  });
});
