import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaComponentComponent } from './empresa-component.component';

describe('EmpresaComponentComponent', () => {
  let component: EmpresaComponentComponent;
  let fixture: ComponentFixture<EmpresaComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
