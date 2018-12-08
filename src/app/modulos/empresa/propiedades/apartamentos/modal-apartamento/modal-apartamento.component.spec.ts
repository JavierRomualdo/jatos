import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApartamentoComponent } from './modal-apartamento.component';

describe('ModalApartamentoComponent', () => {
  let component: ModalApartamentoComponent;
  let fixture: ComponentFixture<ModalApartamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApartamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
