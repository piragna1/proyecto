import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaServiciosAdministrador } from './pagina-servicios-administrador';

describe('PaginaServiciosAdministrador', () => {
  let component: PaginaServiciosAdministrador;
  let fixture: ComponentFixture<PaginaServiciosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaServiciosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaServiciosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
