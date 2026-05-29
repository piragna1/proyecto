import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaModificarTurnoUsuario } from './pagina-modificar-turno-usuario';

describe('PaginaModificarTurnoUsuario', () => {
  let component: PaginaModificarTurnoUsuario;
  let fixture: ComponentFixture<PaginaModificarTurnoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaModificarTurnoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaModificarTurnoUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
