import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingImageComponent } from './finding-image.component';

describe('FindingImageComponent', () => {
  let component: FindingImageComponent;
  let fixture: ComponentFixture<FindingImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
