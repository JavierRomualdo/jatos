import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocalComponent } from './modal-local.component';

describe('ModalLocalComponent', () => {
  let component: ModalLocalComponent;
  let fixture: ComponentFixture<ModalLocalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLocalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
