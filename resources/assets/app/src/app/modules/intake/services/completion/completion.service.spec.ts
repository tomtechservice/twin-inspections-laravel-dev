import { TestBed, inject } from '@angular/core/testing';

import { CompletionService } from './completion.service';

describe('CompletionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompletionService]
    });
  });

  it('should be created', inject([CompletionService], (service: CompletionService) => {
    expect(service).toBeTruthy();
  }));
});
