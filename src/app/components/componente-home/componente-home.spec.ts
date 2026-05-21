import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteHome } from './componente-home';

describe('ComponenteHome', () => {
  let component: ComponenteHome;
  let fixture: ComponentFixture<ComponenteHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponenteHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
