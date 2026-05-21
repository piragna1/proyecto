import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteInicialPeluquero } from './componente-inicial-peluquero';

describe('ComponenteInicialPeluquero', () => {
  let component: ComponenteInicialPeluquero;
  let fixture: ComponentFixture<ComponenteInicialPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteInicialPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteInicialPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
