import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentosListadoComponent } from './apartamentos-listado.component';

describe('ApartamentosListadoComponent', () => {
  let component: ApartamentosListadoComponent;
  let fixture: ComponentFixture<ApartamentosListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartamentosListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
