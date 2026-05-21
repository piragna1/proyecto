import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaClientesAdministrador } from './pagina-clientes-administrador';

describe('PaginaClientesAdministrador', () => {
  let component: PaginaClientesAdministrador;
  let fixture: ComponentFixture<PaginaClientesAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaClientesAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaClientesAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
