import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUbigeoComponent } from './modal-ubigeo.component';

describe('ModalUbigeoComponent', () => {
  let component: ModalUbigeoComponent;
  let fixture: ComponentFixture<ModalUbigeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUbigeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUbigeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
