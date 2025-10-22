import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoNumeroBebidas } from './grafico-numero-bebidas';

describe('GraficoNumeroBebidas', () => {
  let component: GraficoNumeroBebidas;
  let fixture: ComponentFixture<GraficoNumeroBebidas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoNumeroBebidas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoNumeroBebidas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
