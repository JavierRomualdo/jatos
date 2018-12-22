import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlquilerFormularioComponent } from './alquiler-formulario.component';

describe('AlquilerFormularioComponent', () => {
  let component: AlquilerFormularioComponent;
  let fixture: ComponentFixture<AlquilerFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlquilerFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlquilerFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
