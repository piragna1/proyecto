import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarPerfil } from './pagina-editar-perfil';

describe('PaginaEditarPerfil', () => {
  let component: PaginaEditarPerfil;
  let fixture: ComponentFixture<PaginaEditarPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarPerfil],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarPerfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
