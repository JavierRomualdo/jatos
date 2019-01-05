import { TestBed } from '@angular/core/testing';

import { MensajeListadoService } from './mensaje-listado.service';

describe('MensajeListadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MensajeListadoService = TestBed.get(MensajeListadoService);
    expect(service).toBeTruthy();
  });
});
