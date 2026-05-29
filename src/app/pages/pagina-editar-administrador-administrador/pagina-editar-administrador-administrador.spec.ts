import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarAdministradorAdministrador } from './pagina-editar-administrador-administrador';

describe('PaginaEditarAdministradorAdministrador', () => {
  let component: PaginaEditarAdministradorAdministrador;
  let fixture: ComponentFixture<PaginaEditarAdministradorAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarAdministradorAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarAdministradorAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
