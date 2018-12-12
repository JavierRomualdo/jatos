import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesListadoComponent } from './habitaciones-listado.component';

describe('HabitacionesListadoComponent', () => {
  let component: HabitacionesListadoComponent;
  let fixture: ComponentFixture<HabitacionesListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitacionesListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitacionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
