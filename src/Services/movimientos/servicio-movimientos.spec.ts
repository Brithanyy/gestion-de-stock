import { TestBed } from '@angular/core/testing';

import { ServicioMovimientos } from './servicio-movimientos';

describe('ServicioMovimientos', () => {
  let service: ServicioMovimientos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioMovimientos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
