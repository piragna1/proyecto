import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaUsuariosAdministrador } from './pagina-usuarios-administrador';

describe('PaginaUsuariosAdministrador', () => {
  let component: PaginaUsuariosAdministrador;
  let fixture: ComponentFixture<PaginaUsuariosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaUsuariosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaUsuariosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
