import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocherasListadoComponent } from './cocheras-listado.component';

describe('CocherasListadoComponent', () => {
  let component: CocherasListadoComponent;
  let fixture: ComponentFixture<CocherasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocherasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocherasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
