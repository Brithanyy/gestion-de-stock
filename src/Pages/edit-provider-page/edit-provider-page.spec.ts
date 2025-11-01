import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProviderPage } from './edit-provider-page';

describe('EditProviderPage', () => {
  let component: EditProviderPage;
  let fixture: ComponentFixture<EditProviderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProviderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProviderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
