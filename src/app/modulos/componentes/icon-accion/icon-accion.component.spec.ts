import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAccionComponent } from './icon-accion.component';

describe('IconAccionComponent', () => {
  let component: IconAccionComponent;
  let fixture: ComponentFixture<IconAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
