import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteTurnosPeluquero } from './componente-turnos-peluquero';

describe('ComponenteTurnosPeluquero', () => {
  let component: ComponenteTurnosPeluquero;
  let fixture: ComponentFixture<ComponenteTurnosPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteTurnosPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteTurnosPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
