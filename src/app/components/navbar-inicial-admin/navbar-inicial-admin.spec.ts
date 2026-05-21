import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarInicialAdmin } from './navbar-inicial-admin';

describe('NavbarInicialAdmin', () => {
  let component: NavbarInicialAdmin;
  let fixture: ComponentFixture<NavbarInicialAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarInicialAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarInicialAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
