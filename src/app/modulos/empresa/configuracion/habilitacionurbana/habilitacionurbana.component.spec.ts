import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitacionurbanaComponent } from './habilitacionurbana.component';

describe('HabilitacionurbanaComponent', () => {
  let component: HabilitacionurbanaComponent;
  let fixture: ComponentFixture<HabilitacionurbanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitacionurbanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitacionurbanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
