import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalServicioComponent } from './modal-servicio.component';

describe('ModalServicioComponent', () => {
  let component: ModalServicioComponent;
  let fixture: ComponentFixture<ModalServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
