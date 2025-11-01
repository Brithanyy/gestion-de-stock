import { TestBed } from '@angular/core/testing';

import { ServicioProveedor } from './servicio-proveedor';

describe('ServicioProveedor', () => {
  let service: ServicioProveedor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioProveedor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
