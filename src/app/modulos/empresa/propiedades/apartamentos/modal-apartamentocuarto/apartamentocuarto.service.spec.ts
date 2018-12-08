import { TestBed } from '@angular/core/testing';

import { ApartamentocuartoService } from './apartamentocuarto.service';

describe('ApartamentocuartoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApartamentocuartoService = TestBed.get(ApartamentocuartoService);
    expect(service).toBeTruthy();
  });
});
