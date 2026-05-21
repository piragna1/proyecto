import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsuarioNuevoTurno } from './navbar-usuario-nuevo-turno';

describe('NavbarUsuarioNuevoTurno', () => {
  let component: NavbarUsuarioNuevoTurno;
  let fixture: ComponentFixture<NavbarUsuarioNuevoTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsuarioNuevoTurno],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsuarioNuevoTurno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
