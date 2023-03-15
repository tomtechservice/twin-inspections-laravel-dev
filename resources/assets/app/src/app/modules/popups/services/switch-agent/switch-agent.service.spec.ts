import { TestBed, inject } from '@angular/core/testing';

import { SwitchAgentService } from './switch-agent.service';

describe('SwitchAgentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwitchAgentService]
    });
  });

  it('should be created', inject([SwitchAgentService], (service: SwitchAgentService) => {
    expect(service).toBeTruthy();
  }));
});
