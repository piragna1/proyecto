import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaPeluquerosAdministrador } from './pagina-peluqueros-administrador';

describe('PaginaPeluquerosAdministrador', () => {
  let component: PaginaPeluquerosAdministrador;
  let fixture: ComponentFixture<PaginaPeluquerosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaPeluquerosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaPeluquerosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
