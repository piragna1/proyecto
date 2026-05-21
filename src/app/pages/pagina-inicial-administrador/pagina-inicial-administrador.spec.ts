import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaInicialAdministrador } from './pagina-inicial-administrador';

describe('PaginaInicialAdministrador', () => {
  let component: PaginaInicialAdministrador;
  let fixture: ComponentFixture<PaginaInicialAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaInicialAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaInicialAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
