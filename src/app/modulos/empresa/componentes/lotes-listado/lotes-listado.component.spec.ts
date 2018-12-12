import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesListadoComponent } from './lotes-listado.component';

describe('LotesListadoComponent', () => {
  let component: LotesListadoComponent;
  let fixture: ComponentFixture<LotesListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotesListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
