import { TestBed, inject } from '@angular/core/testing';

import { IntakeService } from './intake.service';

describe('IntakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntakeService]
    });
  });

  it('should be created', inject([IntakeService], (service: IntakeService) => {
    expect(service).toBeTruthy();
  }));
});
