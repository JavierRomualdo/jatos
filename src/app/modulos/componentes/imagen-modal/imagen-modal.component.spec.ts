import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenModalComponent } from './imagen-modal.component';

describe('ImagenModalComponent', () => {
  let component: ImagenModalComponent;
  let fixture: ComponentFixture<ImagenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
