import { TestBed } from '@angular/core/testing';

import { AlquilerService } from './alquiler.service';

describe('AlquilerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlquilerService = TestBed.get(AlquilerService);
    expect(service).toBeTruthy();
  });
});
