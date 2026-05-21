import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsuarioHome } from './navbar-usuario-home';

describe('NavbarUsuarioHome', () => {
  let component: NavbarUsuarioHome;
  let fixture: ComponentFixture<NavbarUsuarioHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsuarioHome],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsuarioHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
