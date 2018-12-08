import { TestBed } from '@angular/core/testing';

import { TipoubigeoService } from './tipoubigeo.service';

describe('TipoubigeoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoubigeoService = TestBed.get(TipoubigeoService);
    expect(service).toBeTruthy();
  });
});
