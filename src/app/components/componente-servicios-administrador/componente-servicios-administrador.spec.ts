import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteServiciosAdministrador } from './componente-servicios-administrador';

describe('ComponenteServiciosAdministrador', () => {
  let component: ComponenteServiciosAdministrador;
  let fixture: ComponentFixture<ComponenteServiciosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteServiciosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteServiciosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
