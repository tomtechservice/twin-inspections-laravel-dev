import { IntakeModule } from './intake.module';

describe('IntakeModule', () => {
  let intakeModule: IntakeModule;

  beforeEach(() => {
    intakeModule = new IntakeModule();
  });

  it('should create an instance', () => {
    expect(intakeModule).toBeTruthy();
  });
});
