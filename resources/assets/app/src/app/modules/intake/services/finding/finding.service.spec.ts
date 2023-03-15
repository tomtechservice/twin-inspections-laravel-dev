import { TestBed, inject } from '@angular/core/testing';

import { FindingService } from './finding.service';

describe('FindingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindingService]
    });
  });

  it('should be created', inject([FindingService], (service: FindingService) => {
    expect(service).toBeTruthy();
  }));
});
