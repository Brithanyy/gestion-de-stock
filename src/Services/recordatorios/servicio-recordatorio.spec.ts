import { TestBed } from '@angular/core/testing';

import { ServicioRecordatorio } from './servicio-recordatorio';

describe('ServicioRecordatorio', () => {
  let service: ServicioRecordatorio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioRecordatorio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
