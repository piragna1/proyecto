import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarInicial } from './navbar-inicial';

describe('NavbarInicial', () => {
  let component: NavbarInicial;
  let fixture: ComponentFixture<NavbarInicial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarInicial],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarInicial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
