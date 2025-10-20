import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDrinkPage } from './detail-drink-page';

describe('DetailDrinkPage', () => {
  let component: DetailDrinkPage;
  let fixture: ComponentFixture<DetailDrinkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDrinkPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDrinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
