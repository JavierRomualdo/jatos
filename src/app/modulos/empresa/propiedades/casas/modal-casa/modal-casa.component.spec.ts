import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCasaComponent } from './modal-casa.component';

describe('ModalCasaComponent', () => {
  let component: ModalCasaComponent;
  let fixture: ComponentFixture<ModalCasaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCasaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
