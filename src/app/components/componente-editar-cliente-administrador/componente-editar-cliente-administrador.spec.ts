import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEditarClienteAdministrador } from './componente-editar-cliente-administrador';

describe('ComponenteEditarClienteAdministrador', () => {
  let component: ComponenteEditarClienteAdministrador;
  let fixture: ComponentFixture<ComponenteEditarClienteAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEditarClienteAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteEditarClienteAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
