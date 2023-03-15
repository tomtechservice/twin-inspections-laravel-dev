import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidSecondaryComponent } from './bid-secondary.component';

describe('BidSecondaryComponent', () => {
  let component: BidSecondaryComponent;
  let fixture: ComponentFixture<BidSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
