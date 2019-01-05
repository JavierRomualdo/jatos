import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocheraDetalleComponent } from './cochera-detalle.component';

describe('CocheraDetalleComponent', () => {
  let component: CocheraDetalleComponent;
  let fixture: ComponentFixture<CocheraDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocheraDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocheraDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
