import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsPage } from './movements-page';

describe('MovementsPage', () => {
  let component: MovementsPage;
  let fixture: ComponentFixture<MovementsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
