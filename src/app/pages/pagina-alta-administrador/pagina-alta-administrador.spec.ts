import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAltaAdministrador } from './pagina-alta-administrador';

describe('PaginaAltaAdministrador', () => {
  let component: PaginaAltaAdministrador;
  let fixture: ComponentFixture<PaginaAltaAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAltaAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaAltaAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
