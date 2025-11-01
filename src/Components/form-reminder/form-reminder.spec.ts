import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReminder } from './form-reminder';

describe('FormReminder', () => {
  let component: FormReminder;
  let fixture: ComponentFixture<FormReminder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReminder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormReminder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
