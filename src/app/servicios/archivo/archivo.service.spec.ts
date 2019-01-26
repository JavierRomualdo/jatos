import { TestBed } from '@angular/core/testing';

import { ArchivoService } from './archivo.service';

describe('ArchivoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivoService = TestBed.get(ArchivoService);
    expect(service).toBeTruthy();
  });
});
