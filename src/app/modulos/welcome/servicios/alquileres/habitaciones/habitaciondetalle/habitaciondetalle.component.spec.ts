import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionDetalleComponent } from './habitaciondetalle.component';

describe('HabitacionDetalleComponent', () => {
  let component: HabitacionDetalleComponent;
  let fixture: ComponentFixture<HabitacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
