import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteNuevoTurno } from './componente-nuevo-turno';

describe('ComponenteNuevoTurno', () => {
  let component: ComponenteNuevoTurno;
  let fixture: ComponentFixture<ComponenteNuevoTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteNuevoTurno],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteNuevoTurno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
