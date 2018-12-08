import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocherasComponent } from './cocheras.component';

describe('CocherasComponent', () => {
  let component: CocherasComponent;
  let fixture: ComponentFixture<CocherasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocherasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocherasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
