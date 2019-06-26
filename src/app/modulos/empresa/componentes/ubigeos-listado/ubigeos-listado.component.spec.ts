import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbigeosListadoComponent } from './ubigeos-listado.component';

describe('UbigeosListadoComponent', () => {
  let component: UbigeosListadoComponent;
  let fixture: ComponentFixture<UbigeosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbigeosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbigeosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
