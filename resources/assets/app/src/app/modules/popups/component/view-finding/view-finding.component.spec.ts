import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFindingComponent } from './view-finding.component';

describe('ViewFindingComponent', () => {
  let component: ViewFindingComponent;
  let fixture: ComponentFixture<ViewFindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
