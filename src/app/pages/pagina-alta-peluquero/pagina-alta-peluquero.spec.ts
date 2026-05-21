import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAltaPeluquero } from './pagina-alta-peluquero';

describe('PaginaAltaPeluquero', () => {
  let component: PaginaAltaPeluquero;
  let fixture: ComponentFixture<PaginaAltaPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAltaPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaAltaPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
