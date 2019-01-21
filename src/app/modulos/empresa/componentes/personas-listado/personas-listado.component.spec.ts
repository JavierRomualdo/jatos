import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasListadoComponent } from './personas-listado.component';

describe('PersonasListadoComponent', () => {
  let component: PersonasListadoComponent;
  let fixture: ComponentFixture<PersonasListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonasListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonasListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
