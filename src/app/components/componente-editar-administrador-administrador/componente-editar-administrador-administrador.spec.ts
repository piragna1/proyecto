import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEditarAdministradorAdministrador } from './componente-editar-administrador-administrador';

describe('ComponenteEditarAdministradorAdministrador', () => {
  let component: ComponenteEditarAdministradorAdministrador;
  let fixture: ComponentFixture<ComponenteEditarAdministradorAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEditarAdministradorAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteEditarAdministradorAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
