import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReminderPage } from './new-reminder-page';

describe('NewReminderPage', () => {
  let component: NewReminderPage;
  let fixture: ComponentFixture<NewReminderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReminderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewReminderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
