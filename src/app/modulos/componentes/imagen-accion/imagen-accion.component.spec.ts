import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenAccionComponent } from './imagen-accion.component';

describe('ImagenAccionComponent', () => {
  let component: ImagenAccionComponent;
  let fixture: ComponentFixture<ImagenAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagenAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
