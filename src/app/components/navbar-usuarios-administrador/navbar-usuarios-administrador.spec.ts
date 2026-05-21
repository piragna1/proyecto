import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsuariosAdministrador } from './navbar-usuarios-administrador';

describe('NavbarUsuariosAdministrador', () => {
  let component: NavbarUsuariosAdministrador;
  let fixture: ComponentFixture<NavbarUsuariosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsuariosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsuariosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
