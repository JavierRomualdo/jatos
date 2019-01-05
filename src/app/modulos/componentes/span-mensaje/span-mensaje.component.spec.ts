import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanMensajeComponent } from './span-mensaje.component';

describe('SpanMensajeComponent', () => {
  let component: SpanMensajeComponent;
  let fixture: ComponentFixture<SpanMensajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpanMensajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpanMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
