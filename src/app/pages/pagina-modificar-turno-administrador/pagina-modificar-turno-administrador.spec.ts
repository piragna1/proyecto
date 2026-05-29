import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaModificarTurnoAdministrador } from './pagina-modificar-turno-administrador';

describe('PaginaModificarTurnoAdministrador', () => {
  let component: PaginaModificarTurnoAdministrador;
  let fixture: ComponentFixture<PaginaModificarTurnoAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaModificarTurnoAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaModificarTurnoAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
