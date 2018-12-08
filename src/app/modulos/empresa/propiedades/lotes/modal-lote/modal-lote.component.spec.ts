import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoteComponent } from './modal-lote.component';

describe('ModalLoteComponent', () => {
  let component: ModalLoteComponent;
  let fixture: ComponentFixture<ModalLoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
