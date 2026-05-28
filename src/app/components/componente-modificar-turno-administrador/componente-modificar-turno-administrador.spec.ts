import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteModificarTurnoAdministrador } from './componente-modificar-turno-administrador';

describe('ComponenteModificarTurnoAdministrador', () => {
  let component: ComponenteModificarTurnoAdministrador;
  let fixture: ComponentFixture<ComponenteModificarTurnoAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteModificarTurnoAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteModificarTurnoAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
