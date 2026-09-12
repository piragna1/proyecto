import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNuevoTurnoMostrador } from './pagina-nuevo-turno-mostrador';

describe('PaginaNuevoTurnoMostrador', () => {
  let component: PaginaNuevoTurnoMostrador;
  let fixture: ComponentFixture<PaginaNuevoTurnoMostrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaNuevoTurnoMostrador],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaNuevoTurnoMostrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});