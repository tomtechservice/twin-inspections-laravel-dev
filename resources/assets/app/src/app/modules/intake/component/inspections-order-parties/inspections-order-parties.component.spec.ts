import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionsOrderPartiesComponent } from './inspections-order-parties.component';

describe('InspectionsOrderPartiesComponent', () => {
  let component: InspectionsOrderPartiesComponent;
  let fixture: ComponentFixture<InspectionsOrderPartiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionsOrderPartiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionsOrderPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
