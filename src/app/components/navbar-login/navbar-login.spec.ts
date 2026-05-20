import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLogin } from './navbar-login';

describe('NavbarLogin', () => {
  let component: NavbarLogin;
  let fixture: ComponentFixture<NavbarLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
