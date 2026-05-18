import { TestBed } from '@angular/core/testing';

import { Vin } from './vin';

describe('Vin', () => {
  let service: Vin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
