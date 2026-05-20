import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaLogin } from './pagina-login';

describe('PaginaLogin', () => {
  let component: PaginaLogin;
  let fixture: ComponentFixture<PaginaLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
