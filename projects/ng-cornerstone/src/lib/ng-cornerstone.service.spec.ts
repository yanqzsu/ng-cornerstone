import { TestBed } from '@angular/core/testing';

import { NgCornerstoneService } from './ng-cornerstone.service';

describe('NgCornerstoneService', () => {
  let service: NgCornerstoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgCornerstoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
