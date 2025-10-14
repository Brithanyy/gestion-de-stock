import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLogin } from "../Pages/page-login/page-login";
import { ServicioAutenticacion } from '../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLogin, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-de-stock');

  readonly servicioAutenticacion = inject(ServicioAutenticacion);
  readonly logueado = this.servicioAutenticacion.isLoggedIn; 
  readonly usuario = this.servicioAutenticacion.usuario; 


}
