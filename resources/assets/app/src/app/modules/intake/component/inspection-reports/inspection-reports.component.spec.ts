import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionReportsComponent } from './inspection-reports.component';

describe('InspectionReportsComponent', () => {
  let component: InspectionReportsComponent;
  let fixture: ComponentFixture<InspectionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
