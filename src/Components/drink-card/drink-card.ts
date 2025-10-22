import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { Bebida } from '../../Models/Bebida';
import { CommonModule } from '@angular/common';
import { Alerta } from '../../Services/alerta/alerta';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';

@Component({
  selector: 'app-drink-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drink-card.html',
  styleUrl: './drink-card.css'
})
export class DrinkCard implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  private readonly FORM_BUILDER : FormBuilder = inject(FormBuilder);
  private readonly ALERTA = inject(Alerta);
  private readonly SERVICIO_BEBIDAS = inject(ServicioBebidas);

  bebidasActualizadas: Bebida[] = [];

  @Input() bebida !: Bebida;
  @Input() esAdmin : boolean = false;

  @Output() editar = new EventEmitter<string | undefined>(); 
  @Output() verDetalle = new EventEmitter<string | undefined>();
  @Output() aumentarStock = new EventEmitter<{ bebida: Bebida, cantidad: number }>();
  @Output() decrementarStock = new EventEmitter<{ bebida: Bebida, cantidad: number }>();
  @Output() eliminar = new EventEmitter<string | undefined>();

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
  
  onEliminar() { 
    this.SERVICIO_BEBIDAS.deleteDrink(this.bebida.id!).subscribe({
      next: () => {
        this.ALERTA.mostrar(`✅ La bebida ${this.bebida.name} ha sido eliminada con éxito.`, "success");
        this.eliminar.emit(this.bebida.id);
      },
      error: () => {
        this.ALERTA.mostrar(`❌ Error al eliminar la bebida ${this.bebida.name}. Por favor, inténtelo de nuevo más tarde.`, "danger");
      }
    });
  };
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

    if(cantidad > this.bebida.stock) {
      this.ALERTA.mostrar("⚠️ No hay suficiente stock disponible.", "danger");
      return;
    } 

     // Emitir evento para disminuir el stock
    this.decrementarStock.emit({ bebida: this.bebida, cantidad });

  // Mostrar alerta si el stock restante será bajo (<= 5 pero >= 0)
    if (this.bebida.stock <= 5 && this.bebida.stock >= 0) {
    this.ALERTA.mostrar(
      `⚠️ Quedan pocas unidades de ${this.bebida.name}. Stock actual: ${this.bebida.stock}`,
      "danger"
    );
  }

    this.formEgreso.patchValue({ cantidadEgreso: 1 });
  };

}
