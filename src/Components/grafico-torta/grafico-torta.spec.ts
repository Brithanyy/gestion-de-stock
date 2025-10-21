import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoTorta } from './grafico-torta';

describe('GraficoTorta', () => {
  let component: GraficoTorta;
  let fixture: ComponentFixture<GraficoTorta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoTorta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoTorta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
