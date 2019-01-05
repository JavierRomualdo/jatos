import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesListadoComponent } from './mensajes-listado.component';

describe('MensajesListadoComponent', () => {
  let component: MensajesListadoComponent;
  let fixture: ComponentFixture<MensajesListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajesListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
