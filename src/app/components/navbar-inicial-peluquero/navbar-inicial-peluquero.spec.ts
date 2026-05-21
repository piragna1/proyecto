import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarInicialPeluquero } from './navbar-inicial-peluquero';

describe('NavbarInicialPeluquero', () => {
  let component: NavbarInicialPeluquero;
  let fixture: ComponentFixture<NavbarInicialPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarInicialPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarInicialPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
