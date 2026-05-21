import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteAltaPeluquero } from './componente-alta-peluquero';

describe('ComponenteAltaPeluquero', () => {
  let component: ComponenteAltaPeluquero;
  let fixture: ComponentFixture<ComponenteAltaPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteAltaPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteAltaPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
