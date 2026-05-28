import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteModificarTurnoUsuario } from './componente-modificar-turno-usuario';

describe('ComponenteModificarTurnoUsuario', () => {
  let component: ComponenteModificarTurnoUsuario;
  let fixture: ComponentFixture<ComponenteModificarTurnoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteModificarTurnoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteModificarTurnoUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
