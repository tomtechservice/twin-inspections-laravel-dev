import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingAddComponent } from './finding-add.component';

describe('FindingAddComponent', () => {
  let component: FindingAddComponent;
  let fixture: ComponentFixture<FindingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
