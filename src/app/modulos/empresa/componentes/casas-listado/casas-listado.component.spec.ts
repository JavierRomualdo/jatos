import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasasListadoComponent } from './casas-listado.component';

describe('CasasListadoComponent', () => {
  let component: CasasListadoComponent;
  let fixture: ComponentFixture<CasasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
