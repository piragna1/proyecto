import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaClientesPeluquero } from './pagina-clientes-peluquero';

describe('PaginaClientesPeluquero', () => {
  let component: PaginaClientesPeluquero;
  let fixture: ComponentFixture<PaginaClientesPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaClientesPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaClientesPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
