import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaPeluquero } from './pagina-peluquero';

describe('PaginaPeluquero', () => {
  let component: PaginaPeluquero;
  let fixture: ComponentFixture<PaginaPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
