import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { Bebida } from '../../Models/Bebida';
import { CommonModule } from '@angular/common';
import { Alerta } from '../../Services/alerta/alerta';
import { ServicioBebidas } from '../../Services/bebidas/servicio-bebidas';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioMovimientos } from '../../Services/movimientos/servicio-movimientos';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';
import { Movimiento } from '../../Models/Movimiento';

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
  private readonly SERVICIO_USUARIOS = inject(ServicioUsuarios);
  private readonly SERVICIO_MOVIMIENTOS = inject(ServicioMovimientos);
  readonly ROUTER : Router = inject(Router);
  readonly ACTIVATED_ROUTE : ActivatedRoute = inject(ActivatedRoute);

  bebidasActualizadas: Bebida[] = [];

    usuarioLogueado : Usuario = {
  
        id: "",
        username: "",
        password: "",
        profile: "ninguno",
        isLoggedIn: false,
        avatarUrl: ""
    };

  @Input() bebida !: Bebida;
  @Input() esAdmin : boolean = false;
  @Input() idUser : string = '';

  @Output() bebidaActualizada = new EventEmitter<void>();

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

    this.obtenerUsuario();
  };

  //*MÉTODOS -> Para emitir eventos
  editarBebida(idBebida : string | undefined) { this.ROUTER.navigate(['/editDrinkPage', idBebida]); };
  
  verDetalle(idBebida : string | undefined) { this.ROUTER.navigate(['/detailDrinkPage', idBebida, this.idUser]); };
  
  eliminarBebida(idBebida : string | undefined) {
      
      this.SERVICIO_BEBIDAS.deleteDrink(idBebida).subscribe({

        next: (bebidaDevuelta : Bebida) => {

          this.ALERTA.mostrar("Bebida eliminada con éxito", "success");
          this.bebidaActualizada.emit(); 
        },
        error: (errorDevuelto) => { this.ALERTA.mostrar("Error eliminar la bebida.", "danger"); }
      });

    };
  
  obtenerUsuario() {
  
      this.SERVICIO_USUARIOS.getUser(this.idUser).subscribe({
  
        next: (usuarioDevuelto : Usuario) => { this.usuarioLogueado = usuarioDevuelto; },
  
        error: (errorDevuelto) => { this.ALERTA.mostrar("Error obtener el usuario.", "danger"); }
      });
    };
  
  aumentarStock(bebida : Bebida, cantidad : number) {
  
      bebida.stock += cantidad;
  
      const ingresoMovimiento : Movimiento = {
  
        idDrink: bebida.id!,              
        nameDrink: bebida.name,          
        typeMotion: 'Ingreso', 
        amount: cantidad,              
        movementDate: new Date(Date.now()),         
        idUser: this.usuarioLogueado.id,             
        nameUser: this.usuarioLogueado.username,         
      };
  
      this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({
  
        next: (bebidaDevuelta : Bebida) => { 
   
          this.bebidaActualizada.emit(); 

          this.SERVICIO_MOVIMIENTOS.postMotion(ingresoMovimiento).subscribe({
  
            next: (movimientoDevuelto : Movimiento) => { this.ALERTA.mostrar("Movimiento registrado con éxito", "success"); },
  
            error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
          });

          this.formIngreso.patchValue({
            cantidadIngreso: 1
          });
        },
  
        error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
      });
    };
  
  decrementarStock(bebida : Bebida, cantidad : number) {
  
      if(cantidad > bebida.stock) {
  
        this.ALERTA.mostrar("No puedes egresar más que el stock disponible", "danger");
        return
      }
  
      bebida.stock -= cantidad;
  
      const egresoMovimiento : Movimiento = {
  
        idDrink: bebida.id!,              
        nameDrink: bebida.name,          
        typeMotion: 'Egreso', 
        amount: cantidad,              
        movementDate: new Date(Date.now()),         
        idUser: this.usuarioLogueado.id,             
        nameUser: this.usuarioLogueado.username,         
      };
  
      this.SERVICIO_BEBIDAS.putDrink(bebida).subscribe({
  
        next: (bebidaDevuelta : Bebida) => { 
  
          this.bebidaActualizada.emit(); 

          this.SERVICIO_MOVIMIENTOS.postMotion(egresoMovimiento).subscribe({
  
            next: (movimientoDevuelto : Movimiento) => { this.ALERTA.mostrar("Movimiento registrado con éxito", "success"); },
  
            error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el movimiento", "danger"); }
          });

          this.formEgreso.patchValue({
            cantidadEgreso: 1
          });
        },
  
        error: (errorDevuelto) => { this.ALERTA.mostrar("Error al registrar el ingreso", "danger"); }
      });
    };

}
