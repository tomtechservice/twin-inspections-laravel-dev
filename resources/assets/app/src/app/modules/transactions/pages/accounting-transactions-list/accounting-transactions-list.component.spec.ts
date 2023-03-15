import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingTransactionsListComponent } from './accounting-transactions-list.component';

describe('AccountingTransactionsListComponent', () => {
  let component: AccountingTransactionsListComponent;
  let fixture: ComponentFixture<AccountingTransactionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingTransactionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
