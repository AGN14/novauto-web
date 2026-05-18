import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleAnnonce } from './nouvelle-annonce';

describe('NouvelleAnnonce', () => {
  let component: NouvelleAnnonce;
  let fixture: ComponentFixture<NouvelleAnnonce>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouvelleAnnonce],
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelleAnnonce);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
