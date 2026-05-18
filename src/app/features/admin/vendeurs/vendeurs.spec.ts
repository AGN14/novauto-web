import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vendeurs } from './vendeurs';

describe('Vendeurs', () => {
  let component: Vendeurs;
  let fixture: ComponentFixture<Vendeurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vendeurs],
    }).compileComponents();

    fixture = TestBed.createComponent(Vendeurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
