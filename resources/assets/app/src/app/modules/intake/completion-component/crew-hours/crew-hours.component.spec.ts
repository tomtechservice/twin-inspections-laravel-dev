import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewHoursComponent } from './crew-hours.component';

describe('CrewHoursComponent', () => {
  let component: CrewHoursComponent;
  let fixture: ComponentFixture<CrewHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrewHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrewHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
