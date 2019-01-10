import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioMailComponent } from './formulario-mail.component';

describe('FormularioMailComponent', () => {
  let component: FormularioMailComponent;
  let fixture: ComponentFixture<FormularioMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
