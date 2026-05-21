import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteInicialAdministrador } from './componente-inicial-administrador';

describe('ComponenteInicialAdministrador', () => {
  let component: ComponenteInicialAdministrador;
  let fixture: ComponentFixture<ComponenteInicialAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteInicialAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteInicialAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
