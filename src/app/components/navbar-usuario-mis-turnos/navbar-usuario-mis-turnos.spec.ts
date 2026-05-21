import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarUsuarioMisTurnos } from './navbar-usuario-mis-turnos';

describe('NavbarUsuarioMisTurnos', () => {
  let component: NavbarUsuarioMisTurnos;
  let fixture: ComponentFixture<NavbarUsuarioMisTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarUsuarioMisTurnos],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarUsuarioMisTurnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
