import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionTasksComponent } from './completion-tasks.component';

describe('CompletionTasksComponent', () => {
  let component: CompletionTasksComponent;
  let fixture: ComponentFixture<CompletionTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletionTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletionTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
