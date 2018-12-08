import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteDetalleComponent } from './lotedetalle.component';

describe('LoteDetalleComponent', () => {
  let component: LoteDetalleComponent;
  let fixture: ComponentFixture<LoteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
