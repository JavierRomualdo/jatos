import { TestBed } from '@angular/core/testing';

import { UbigeoService } from './ubigeo.service';

describe('UbigeoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UbigeoService = TestBed.get(UbigeoService);
    expect(service).toBeTruthy();
  });
});
