import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VinDecoder } from './vin-decoder';

describe('VinDecoder', () => {
  let component: VinDecoder;
  let fixture: ComponentFixture<VinDecoder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VinDecoder],
    }).compileComponents();

    fixture = TestBed.createComponent(VinDecoder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
