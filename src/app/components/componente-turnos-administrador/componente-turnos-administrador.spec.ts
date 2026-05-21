import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteTurnosAdministrador } from './componente-turnos-administrador';

describe('ComponenteTurnosAdministrador', () => {
  let component: ComponenteTurnosAdministrador;
  let fixture: ComponentFixture<ComponenteTurnosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteTurnosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteTurnosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
