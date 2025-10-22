import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDrink } from './form-drink';

describe('FormDrink', () => {
  let component: FormDrink;
  let fixture: ComponentFixture<FormDrink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDrink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDrink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
