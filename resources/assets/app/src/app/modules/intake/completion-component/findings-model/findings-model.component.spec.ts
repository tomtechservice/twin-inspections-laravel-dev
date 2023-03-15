import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsModelComponent } from './findings-model.component';

describe('FindingsModelComponent', () => {
  let component: FindingsModelComponent;
  let fixture: ComponentFixture<FindingsModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingsModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
