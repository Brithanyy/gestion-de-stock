import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoProductosBajos } from './grafico-productos-bajos';

describe('GraficoProductosBajos', () => {
  let component: GraficoProductosBajos;
  let fixture: ComponentFixture<GraficoProductosBajos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoProductosBajos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoProductosBajos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
