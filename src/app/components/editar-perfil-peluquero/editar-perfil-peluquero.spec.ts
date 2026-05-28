import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilPeluquero } from './editar-perfil-peluquero';

describe('EditarPerfilPeluquero', () => {
  let component: EditarPerfilPeluquero;
  let fixture: ComponentFixture<EditarPerfilPeluquero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPerfilPeluquero],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilPeluquero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
