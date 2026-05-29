import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarPerfilAdministrador } from './pagina-editar-perfil-administrador';

describe('PaginaEditarPerfilAdministrador', () => {
  let component: PaginaEditarPerfilAdministrador;
  let fixture: ComponentFixture<PaginaEditarPerfilAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarPerfilAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarPerfilAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
