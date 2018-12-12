import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalesListadoComponent } from './locales-listado.component';

describe('LocalesListadoComponent', () => {
  let component: LocalesListadoComponent;
  let fixture: ComponentFixture<LocalesListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalesListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
