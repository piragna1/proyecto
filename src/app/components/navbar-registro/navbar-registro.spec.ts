import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRegistro } from './navbar-registro';

describe('NavbarRegistro', () => {
  let component: NavbarRegistro;
  let fixture: ComponentFixture<NavbarRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRegistro],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
