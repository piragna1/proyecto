import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMisTurnos } from './componente-mis-turnos';

describe('ComponenteMisTurnos', () => {
  let component: ComponenteMisTurnos;
  let fixture: ComponentFixture<ComponenteMisTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMisTurnos],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteMisTurnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
