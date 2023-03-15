import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalWorkPerformedComponent } from './additional-work-performed.component';

describe('AdditionalWorkPerformedComponent', () => {
  let component: AdditionalWorkPerformedComponent;
  let fixture: ComponentFixture<AdditionalWorkPerformedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalWorkPerformedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalWorkPerformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
