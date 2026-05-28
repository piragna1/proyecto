import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEditarPeluqueroAdministrador } from './componente-editar-peluquero-administrador';

describe('ComponenteEditarPeluqueroAdministrador', () => {
  let component: ComponenteEditarPeluqueroAdministrador;
  let fixture: ComponentFixture<ComponenteEditarPeluqueroAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEditarPeluqueroAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteEditarPeluqueroAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
