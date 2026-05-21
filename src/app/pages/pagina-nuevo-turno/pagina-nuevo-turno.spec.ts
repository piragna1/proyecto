import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNuevoTurno } from './pagina-nuevo-turno';

describe('PaginaNuevoTurno', () => {
  let component: PaginaNuevoTurno;
  let fixture: ComponentFixture<PaginaNuevoTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaNuevoTurno],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaNuevoTurno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
