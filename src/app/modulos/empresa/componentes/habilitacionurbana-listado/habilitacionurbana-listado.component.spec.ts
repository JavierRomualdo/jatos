import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitacionurbanaListadoComponent } from './habilitacionurbana-listado.component';

describe('HabilitacionurbanaListadoComponent', () => {
  let component: HabilitacionurbanaListadoComponent;
  let fixture: ComponentFixture<HabilitacionurbanaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitacionurbanaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitacionurbanaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
