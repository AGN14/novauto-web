import { TestBed } from '@angular/core/testing';

import { Simulateur } from './simulateur';

describe('Simulateur', () => {
  let service: Simulateur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Simulateur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
