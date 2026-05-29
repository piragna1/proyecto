import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarPerfilPeluquero } from './pagina-editar-perfil-peluquero';

describe('PaginaEditarPerfilPeluquero', () => {
  let component: PaginaEditarPerfilPeluquero;
  let fixture: ComponentFixture<PaginaEditarPerfilPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarPerfilPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarPerfilPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
