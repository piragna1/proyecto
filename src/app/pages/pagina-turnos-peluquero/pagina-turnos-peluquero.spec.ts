import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaTurnosPeluquero } from './pagina-turnos-peluquero';

describe('PaginaTurnosPeluquero', () => {
  let component: PaginaTurnosPeluquero;
  let fixture: ComponentFixture<PaginaTurnosPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaTurnosPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaTurnosPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
