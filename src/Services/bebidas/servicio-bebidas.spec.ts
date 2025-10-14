import { TestBed } from '@angular/core/testing';

import { ServicioBebidas } from './servicio-bebidas';

describe('ServicioBebidas', () => {
  let service: ServicioBebidas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioBebidas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
