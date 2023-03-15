import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionsOrderComponent } from './inspections-order.component';

describe('InspectionsOrderComponent', () => {
  let component: InspectionsOrderComponent;
  let fixture: ComponentFixture<InspectionsOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionsOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
