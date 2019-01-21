import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasFormularioComponent } from './personas-formulario.component';

describe('PersonasFormularioComponent', () => {
  let component: PersonasFormularioComponent;
  let fixture: ComponentFixture<PersonasFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonasFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
