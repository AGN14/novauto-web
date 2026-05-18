import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Annonces } from './annonces';

describe('Annonces', () => {
  let component: Annonces;
  let fixture: ComponentFixture<Annonces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Annonces],
    }).compileComponents();

    fixture = TestBed.createComponent(Annonces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
