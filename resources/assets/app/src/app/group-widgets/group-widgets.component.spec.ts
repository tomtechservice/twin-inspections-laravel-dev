import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWidgetsComponent } from './group-widgets.component';

describe('GroupWidgetsComponent', () => {
  let component: GroupWidgetsComponent;
  let fixture: ComponentFixture<GroupWidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
