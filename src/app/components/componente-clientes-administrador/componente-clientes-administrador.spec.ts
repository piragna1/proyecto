import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteClientesAdministrador } from './componente-clientes-administrador';

describe('ComponenteClientesAdministrador', () => {
  let component: ComponenteClientesAdministrador;
  let fixture: ComponentFixture<ComponenteClientesAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteClientesAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteClientesAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
