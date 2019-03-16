import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitacionurbanaFormularioComponent } from './habilitacionurbana-formulario.component';

describe('HabilitacionurbanaFormularioComponent', () => {
  let component: HabilitacionurbanaFormularioComponent;
  let fixture: ComponentFixture<HabilitacionurbanaFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitacionurbanaFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitacionurbanaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
