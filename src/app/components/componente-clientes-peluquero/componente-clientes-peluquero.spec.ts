import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteClientesPeluquero } from './componente-clientes-peluquero';

describe('ComponenteClientesPeluquero', () => {
  let component: ComponenteClientesPeluquero;
  let fixture: ComponentFixture<ComponenteClientesPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteClientesPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteClientesPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
