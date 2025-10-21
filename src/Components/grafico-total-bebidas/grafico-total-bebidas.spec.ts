import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTotalBebidas } from './grafico-total-bebidas';

describe('GraficoTotalBebidas', () => {
  let component: GraficoTotalBebidas;
  let fixture: ComponentFixture<GraficoTotalBebidas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTotalBebidas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoTotalBebidas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
