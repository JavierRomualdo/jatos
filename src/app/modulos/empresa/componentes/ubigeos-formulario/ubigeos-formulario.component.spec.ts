import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbigeosFormularioComponent } from './ubigeos-formulario.component';

describe('UbigeosFormularioComponent', () => {
  let component: UbigeosFormularioComponent;
  let fixture: ComponentFixture<UbigeosFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbigeosFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbigeosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
