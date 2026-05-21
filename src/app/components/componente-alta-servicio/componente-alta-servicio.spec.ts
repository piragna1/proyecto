import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteAltaServicio } from './componente-alta-servicio';

describe('ComponenteAltaServicio', () => {
  let component: ComponenteAltaServicio;
  let fixture: ComponentFixture<ComponenteAltaServicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteAltaServicio],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteAltaServicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
