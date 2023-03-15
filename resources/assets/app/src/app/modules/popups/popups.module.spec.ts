import { PopupsModule } from './popups.module';

describe('PopupsModule', () => {
  let popupsModule: PopupsModule;

  beforeEach(() => {
    popupsModule = new PopupsModule();
  });

  it('should create an instance', () => {
    expect(popupsModule).toBeTruthy();
  });
});
