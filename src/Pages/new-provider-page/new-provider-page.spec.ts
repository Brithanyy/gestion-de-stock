import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProviderPage } from './new-provider-page';

describe('NewProviderPage', () => {
  let component: NewProviderPage;
  let fixture: ComponentFixture<NewProviderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProviderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
