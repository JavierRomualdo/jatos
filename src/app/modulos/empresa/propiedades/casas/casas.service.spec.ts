import { TestBed } from '@angular/core/testing';

import { CasasService } from './casas.service';

describe('CasasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CasasService = TestBed.get(CasasService);
    expect(service).toBeTruthy();
  });
});
