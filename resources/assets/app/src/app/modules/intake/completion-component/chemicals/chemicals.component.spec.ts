import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalsComponent } from './chemicals.component';

describe('ChemicalsComponent', () => {
  let component: ChemicalsComponent;
  let fixture: ComponentFixture<ChemicalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
