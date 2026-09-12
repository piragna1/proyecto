import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteNuevoTurnoMostrador } from './componente-nuevo-turno-mostrador';

describe('ComponenteNuevoTurnoMostrador', () => {
  let component: ComponenteNuevoTurnoMostrador;
  let fixture: ComponentFixture<ComponenteNuevoTurnoMostrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteNuevoTurnoMostrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteNuevoTurnoMostrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});