import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocheradetalleComponent } from './cocheradetalle.component';

describe('CocheradetalleComponent', () => {
  let component: CocheradetalleComponent;
  let fixture: ComponentFixture<CocheradetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocheradetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocheradetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
