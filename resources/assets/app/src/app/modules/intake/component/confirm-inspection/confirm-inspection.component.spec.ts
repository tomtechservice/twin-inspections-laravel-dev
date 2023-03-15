import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInspectionComponent } from './confirm-inspection.component';

describe('ConfirmInspectionComponent', () => {
  let component: ConfirmInspectionComponent;
  let fixture: ComponentFixture<ConfirmInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
