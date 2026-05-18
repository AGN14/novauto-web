import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Simulateur } from './simulateur';

describe('Simulateur', () => {
  let component: Simulateur;
  let fixture: ComponentFixture<Simulateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Simulateur],
    }).compileComponents();

    fixture = TestBed.createComponent(Simulateur);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
