import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { Bebida } from '../../Models/Bebida';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drink-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drink-card.html',
  styleUrl: './drink-card.css'
})
export class DrinkCard implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  private readonly FORM_BUILDER : FormBuilder = inject(FormBuilder);

  @Input() bebida !: Bebida;
  @Input() esAdmin : boolean = false;

  @Output() editar = new EventEmitter<string | undefined>(); 
  @Output() eliminar = new EventEmitter<string | undefined>();
  @Output() verDetalle = new EventEmitter<string | undefined>();
  @Output() aumentarStock = new EventEmitter<{ bebida: Bebida, cantidad: number }>();
  @Output() decrementarStock = new EventEmitter<{ bebida: Bebida, cantidad: number }>();

  formIngreso !: FormGroup;
  formEgreso !: FormGroup;
  
  //*MÉTODOS
  ngOnInit(): void {

    this.formIngreso = this.FORM_BUILDER.group({
      cantidadIngreso: [1, [Validators.required, Validators.min(1)]]
    });

    this.formEgreso = this.FORM_BUILDER.group({
      cantidadEgreso: [1, [Validators.required, Validators.min(1)]]
    });
  };

  //*MÉTODOS -> Para emitir eventos
  onEditar() { this.editar.emit(this.bebida.id); };
  onEliminar() { this.eliminar.emit(this.bebida.id); };
  onVerDetalle() { this.verDetalle.emit(this.bebida.id); };

  onAumentar() {

    const cantidad = this.formIngreso.value.cantidadIngreso;

    if (cantidad && cantidad > 0) {

      this.aumentarStock.emit({ bebida: this.bebida, cantidad });
      this.formIngreso.patchValue({ cantidadIngreso: 1 });
    };
  };

  onDisminuir() {

    const cantidad = this.formEgreso.value.cantidadEgreso;

    if(cantidad > this.bebida.stock) return;

    this.decrementarStock.emit({ bebida: this.bebida, cantidad });
    this.formEgreso.patchValue({ cantidadEgreso: 1 });
  };

}
