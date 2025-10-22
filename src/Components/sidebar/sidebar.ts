import { Component, computed, inject, signal } from '@angular/core';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  //*CONSTANTES Y VARIABLES GLOBALES
  private servicioAuth = inject(ServicioAutenticacion);
  usuario = this.servicioAuth.usuario;
  tipoUsuario = computed(() => this.usuario()?.profile);

  // Control de apertura/cierre (para pantallas chicas)
  abierta = signal<boolean>(false);

  //*MÉTODOS
  toggleSidebar() { this.abierta.update(v => !v); }

  esAdmin() { return this.tipoUsuario()?.toLowerCase() === 'admin'; }


}
