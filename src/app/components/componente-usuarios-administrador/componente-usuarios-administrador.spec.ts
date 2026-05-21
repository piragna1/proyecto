import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteUsuariosAdministrador } from './componente-usuarios-administrador';

describe('ComponenteUsuariosAdministrador', () => {
  let component: ComponenteUsuariosAdministrador;
  let fixture: ComponentFixture<ComponenteUsuariosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteUsuariosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteUsuariosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
