import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaServiciosPeluquero } from './pagina-servicios-peluquero';

describe('PaginaServiciosPeluquero', () => {
  let component: PaginaServiciosPeluquero;
  let fixture: ComponentFixture<PaginaServiciosPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaServiciosPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaServiciosPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
