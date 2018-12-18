import { TestBed } from '@angular/core/testing';

import { VentaServiceService } from './venta-service.service';

describe('VentaServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VentaServiceService = TestBed.get(VentaServiceService);
    expect(service).toBeTruthy();
  });
});
