import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLogin } from "../Pages/page-login/page-login";
import { ServicioAutenticacion } from '../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';
import { Alertas } from "../Components/alertas/alertas";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alertas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-de-stock');

}
