import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaInicialPeluquero } from './pagina-inicial-peluquero';

describe('PaginaInicialPeluquero', () => {
  let component: PaginaInicialPeluquero;
  let fixture: ComponentFixture<PaginaInicialPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaInicialPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaInicialPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
