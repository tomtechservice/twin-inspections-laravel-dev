import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidPrimaryComponent } from './bid-primary.component';

describe('BidPrimaryComponent', () => {
  let component: BidPrimaryComponent;
  let fixture: ComponentFixture<BidPrimaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidPrimaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
