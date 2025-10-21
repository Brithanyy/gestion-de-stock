import { Component, inject } from '@angular/core';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';

@Component({
  selector: 'app-alerts-page',
  imports: [],
  templateUrl: './alerts-page.html',
  styleUrl: './alerts-page.css'
})
export class AlertsPage {
   readonly servicioUsuarios : ServicioUsuarios = inject(ServicioUsuarios);

  usuarios: Usuario[] = [];

  
}
