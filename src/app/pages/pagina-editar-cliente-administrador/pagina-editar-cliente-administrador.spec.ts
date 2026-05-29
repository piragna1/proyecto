import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaEditarClienteAdministrador } from './pagina-editar-cliente-administrador';

describe('PaginaEditarClienteAdministrador', () => {
  let component: PaginaEditarClienteAdministrador;
  let fixture: ComponentFixture<PaginaEditarClienteAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaEditarClienteAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaEditarClienteAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
