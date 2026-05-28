import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPeluquero } from './formulario-peluquero';

describe('FormularioPeluquero', () => {
  let component: FormularioPeluquero;
  let fixture: ComponentFixture<FormularioPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
