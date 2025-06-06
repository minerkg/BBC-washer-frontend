import { TestBed } from '@angular/core/testing';

import { BookableUnitService } from './bookable-unit.service';

describe('BookableUnitService', () => {
  let service: BookableUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookableUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
