import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEditarServicioAdministrador } from './componente-editar-servicio-administrador';

describe('ComponenteEditarServicioAdministrador', () => {
  let component: ComponenteEditarServicioAdministrador;
  let fixture: ComponentFixture<ComponenteEditarServicioAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEditarServicioAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteEditarServicioAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
