import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupcodeComponent } from './lookupcode.component';

describe('LookupcodeComponent', () => {
  let component: LookupcodeComponent;
  let fixture: ComponentFixture<LookupcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
