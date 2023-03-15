import { LockoutModule } from './lockout.module';

describe('IntakeModule', () => {
  let lockoutModule: LockoutModule;

  beforeEach(() => {
    lockoutModule = new LockoutModule();
  });

  it('should create an instance', () => {
    expect(lockoutModule).toBeTruthy();
  });
});
