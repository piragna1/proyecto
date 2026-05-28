import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilAdministrador } from './editar-perfil-administrador';

describe('EditarPerfilAdministrador', () => {
  let component: EditarPerfilAdministrador;
  let fixture: ComponentFixture<EditarPerfilAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
