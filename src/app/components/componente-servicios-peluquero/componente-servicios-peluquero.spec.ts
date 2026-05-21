import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteServiciosPeluquero } from './componente-servicios-peluquero';

describe('ComponenteServiciosPeluquero', () => {
  let component: ComponenteServiciosPeluquero;
  let fixture: ComponentFixture<ComponenteServiciosPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteServiciosPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteServiciosPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
