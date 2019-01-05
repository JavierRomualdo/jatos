import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasaDetalleComponent } from './casa-detalle.component';

describe('CasaDetalleComponent', () => {
  let component: CasaDetalleComponent;
  let fixture: ComponentFixture<CasaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
