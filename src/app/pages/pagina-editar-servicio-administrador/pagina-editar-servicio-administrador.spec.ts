import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarServicioAdministrador } from './pagina-editar-servicio-administrador';

describe('PaginaEditarServicioAdministrador', () => {
  let component: PaginaEditarServicioAdministrador;
  let fixture: ComponentFixture<PaginaEditarServicioAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarServicioAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarServicioAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
