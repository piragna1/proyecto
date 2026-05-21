import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteAltaAdministrador } from './componente-alta-administrador';

describe('ComponenteAltaAdministrador', () => {
  let component: ComponenteAltaAdministrador;
  let fixture: ComponentFixture<ComponenteAltaAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteAltaAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteAltaAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
