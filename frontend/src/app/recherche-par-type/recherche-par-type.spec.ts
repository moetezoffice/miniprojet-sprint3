import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheParTypeComponent } from './recherche-par-type';

describe('RechercheParTypeComponent', () => {
  let component: RechercheParTypeComponent;
  let fixture: ComponentFixture<RechercheParTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheParTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheParTypeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
