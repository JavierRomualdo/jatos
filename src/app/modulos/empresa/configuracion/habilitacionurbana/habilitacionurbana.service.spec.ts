import { TestBed } from '@angular/core/testing';

import { HabilitacionurbanaService } from './habilitacionurbana.service';

describe('HabilitacionurbanaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HabilitacionurbanaService = TestBed.get(HabilitacionurbanaService);
    expect(service).toBeTruthy();
  });
});
