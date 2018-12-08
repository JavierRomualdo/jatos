import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCocheraComponent } from './modal-cochera.component';

describe('ModalCocheraComponent', () => {
  let component: ModalCocheraComponent;
  let fixture: ComponentFixture<ModalCocheraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCocheraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCocheraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
