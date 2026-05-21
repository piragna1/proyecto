import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteAdministradoresAdministrador } from './componente-administradores-administrador';

describe('ComponenteAdministradoresAdministrador', () => {
  let component: ComponenteAdministradoresAdministrador;
  let fixture: ComponentFixture<ComponenteAdministradoresAdministrador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteAdministradoresAdministrador],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteAdministradoresAdministrador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
