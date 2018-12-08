import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalApartamentocuartoComponent } from './modal-apartamentocuarto.component';

describe('ModalApartamentocuartoComponent', () => {
  let component: ModalApartamentocuartoComponent;
  let fixture: ComponentFixture<ModalApartamentocuartoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalApartamentocuartoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalApartamentocuartoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
