import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemAppHoursComponent } from './chem-app-hours.component';

describe('ChemAppHoursComponent', () => {
  let component: ChemAppHoursComponent;
  let fixture: ComponentFixture<ChemAppHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemAppHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemAppHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
