import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosFormularioComponent } from './servicios-formulario.component';

describe('ServiciosFormularioComponent', () => {
  let component: ServiciosFormularioComponent;
  let fixture: ComponentFixture<ServiciosFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
