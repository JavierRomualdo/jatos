import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropiedadDetalleComponent } from './propiedaddetalle.component';

describe('PropiedadDetalleComponent', () => {
  let component: PropiedadDetalleComponent;
  let fixture: ComponentFixture<PropiedadDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropiedadDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropiedadDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
