import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteNotificacionesAdministrador } from './componente-notificaciones-administrador';

describe('ComponenteNotificacionesAdministrador', () => {
  let component: ComponenteNotificacionesAdministrador;
  let fixture: ComponentFixture<ComponenteNotificacionesAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteNotificacionesAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteNotificacionesAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});