import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTipoubigeoComponent } from './modal-tipoubigeo.component';

describe('ModalTipoubigeoComponent', () => {
  let component: ModalTipoubigeoComponent;
  let fixture: ComponentFixture<ModalTipoubigeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTipoubigeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTipoubigeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
