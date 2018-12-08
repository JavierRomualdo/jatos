import { TestBed } from '@angular/core/testing';

import { CocheraService } from './cochera.service';

describe('CocheraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CocheraService = TestBed.get(CocheraService);
    expect(service).toBeTruthy();
  });
});
