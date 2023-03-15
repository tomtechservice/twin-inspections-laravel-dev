import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsChemicalsAppliedModelComponent } from './findings-chemicals-applied-model.component';

describe('FindingsChemicalsAppliedModelComponent', () => {
  let component: FindingsChemicalsAppliedModelComponent;
  let fixture: ComponentFixture<FindingsChemicalsAppliedModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingsChemicalsAppliedModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsChemicalsAppliedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
