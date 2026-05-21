import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaTurnosAdministrador } from './pagina-turnos-administrador';

describe('PaginaTurnosAdministrador', () => {
  let component: PaginaTurnosAdministrador;
  let fixture: ComponentFixture<PaginaTurnosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaTurnosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaTurnosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
