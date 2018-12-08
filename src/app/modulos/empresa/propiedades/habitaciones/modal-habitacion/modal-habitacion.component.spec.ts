import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHabitacionComponent } from './modal-habitacion.component';

describe('ModalHabitacionComponent', () => {
  let component: ModalHabitacionComponent;
  let fixture: ComponentFixture<ModalHabitacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalHabitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
