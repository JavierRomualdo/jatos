import { TestBed } from '@angular/core/testing';

import { PropiedadesService } from './propiedades.service';

describe('PropiedadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropiedadesService = TestBed.get(PropiedadesService);
    expect(service).toBeTruthy();
  });
});
