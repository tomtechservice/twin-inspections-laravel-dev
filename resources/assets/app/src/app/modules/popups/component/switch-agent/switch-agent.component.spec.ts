import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchAgentComponent } from './switch-agent.component';

describe('SwitchAgentComponent', () => {
  let component: SwitchAgentComponent;
  let fixture: ComponentFixture<SwitchAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
