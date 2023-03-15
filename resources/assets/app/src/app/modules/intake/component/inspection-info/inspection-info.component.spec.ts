import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionInfoComponent } from './inspection-info.component';

describe('InspectionInfoComponent', () => {
  let component: InspectionInfoComponent;
  let fixture: ComponentFixture<InspectionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
