import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubContractorsComponent } from './sub-contractors.component';

describe('SubContractorsComponent', () => {
  let component: SubContractorsComponent;
  let fixture: ComponentFixture<SubContractorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubContractorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubContractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
