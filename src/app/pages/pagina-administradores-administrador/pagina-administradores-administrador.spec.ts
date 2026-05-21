import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAdministradoresAdministrador } from './pagina-administradores-administrador';

describe('PaginaAdministradoresAdministrador', () => {
  let component: PaginaAdministradoresAdministrador;
  let fixture: ComponentFixture<PaginaAdministradoresAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAdministradoresAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaAdministradoresAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
