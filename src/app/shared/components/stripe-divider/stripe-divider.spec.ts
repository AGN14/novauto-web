import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeDivider } from './stripe-divider';

describe('StripeDivider', () => {
  let component: StripeDivider;
  let fixture: ComponentFixture<StripeDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeDivider],
    }).compileComponents();

    fixture = TestBed.createComponent(StripeDivider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
