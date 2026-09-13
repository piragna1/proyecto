import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNotificacionesAdministrador } from './pagina-notificaciones-administrador';

describe('PaginaNotificacionesAdministrador', () => {
  let component: PaginaNotificacionesAdministrador;
  let fixture: ComponentFixture<PaginaNotificacionesAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaNotificacionesAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaNotificacionesAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});