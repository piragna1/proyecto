import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaAltaServicio } from './pagina-alta-servicio';

describe('PaginaAltaServicio', () => {
  let component: PaginaAltaServicio;
  let fixture: ComponentFixture<PaginaAltaServicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaAltaServicio],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaAltaServicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
