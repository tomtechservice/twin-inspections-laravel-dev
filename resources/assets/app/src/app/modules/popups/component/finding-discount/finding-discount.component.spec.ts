import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingDiscountComponent } from './finding-discount.component';

describe('FindingDiscountComponent', () => {
  let component: FindingDiscountComponent;
  let fixture: ComponentFixture<FindingDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindingDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
