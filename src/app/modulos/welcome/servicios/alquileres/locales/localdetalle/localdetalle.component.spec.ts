import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalDetalleComponent } from './localdetalle.component';

describe('LocalDetalleComponent', () => {
  let component: LocalDetalleComponent;
  let fixture: ComponentFixture<LocalDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
