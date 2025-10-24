import { TestBed } from '@angular/core/testing';

import { EmailJS } from './email-js';

describe('EmailJS', () => {
  let service: EmailJS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailJS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
