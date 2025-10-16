import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUsuarios } from './page-usuarios';

describe('PageUsuarios', () => {
  let component: PageUsuarios;
  let fixture: ComponentFixture<PageUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
