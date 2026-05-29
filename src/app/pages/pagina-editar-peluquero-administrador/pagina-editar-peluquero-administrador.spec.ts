import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarPeluqueroAdministrador } from './pagina-editar-peluquero-administrador';

describe('PaginaEditarPeluqueroAdministrador', () => {
  let component: PaginaEditarPeluqueroAdministrador;
  let fixture: ComponentFixture<PaginaEditarPeluqueroAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarPeluqueroAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarPeluqueroAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
