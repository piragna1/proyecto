import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaMisTurnos } from './pagina-mis-turnos';

describe('PaginaMisTurnos', () => {
  let component: PaginaMisTurnos;
  let fixture: ComponentFixture<PaginaMisTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaMisTurnos],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaMisTurnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
