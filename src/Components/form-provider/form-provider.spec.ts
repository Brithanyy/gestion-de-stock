import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProvider } from './form-provider';

describe('FormProvider', () => {
  let component: FormProvider;
  let fixture: ComponentFixture<FormProvider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProvider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProvider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
