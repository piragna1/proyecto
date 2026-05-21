import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentePeluquerosAdministrador } from './componente-peluqueros-administrador';

describe('ComponentePeluquerosAdministrador', () => {
  let component: ComponentePeluquerosAdministrador;
  let fixture: ComponentFixture<ComponentePeluquerosAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentePeluquerosAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentePeluquerosAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
