import { Component, inject, OnInit } from '@angular/core';
import { ServicioRecordatorio } from '../../Services/recordatorios/servicio-recordatorio';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Router } from '@angular/router';
import { Alerta } from '../../Services/alerta/alerta';
import { Recordatorio } from '../../Models/Recordatorio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Usuario } from '../../Models/Usuario';

@Component({
  selector: 'app-reminder-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-page.html',
  styleUrl: './reminder-page.css'
})
export class ReminderPage implements OnInit{
  readonly SERVICIO_REECORDATORIO = inject(ServicioRecordatorio);
  readonly SERVICIO_AUTENTICACION = inject(ServicioAutenticacion);
  readonly SERVICIO_USUARIOS = inject(ServicioUsuarios);
  readonly ROUTER = inject(Router);
  readonly ALERTA = inject(Alerta);

  recordatorios: Recordatorio[] = [];
  recordatoriosFiltrados: Recordatorio[] = [];
  terminoBusqueda: string = '';
  usuarios: Usuario[] = [];


  ngOnInit(): void {
    this.obtenerRecordatorios();
    this.obtenerUsuarios();
  }

  obtenerRecordatorios() {
    this.SERVICIO_REECORDATORIO.getAllReminders().subscribe({
      next : (data: Recordatorio[]) => {
        this.recordatorios = data;
        this.recordatoriosFiltrados = [...data];
      },
      error : () => this.ALERTA.mostrar('Error al cargar los recordatorios.', 'danger')
    })
  }

  filtrarRecordatorios() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.recordatoriosFiltrados = this.recordatorios.filter(reco =>
      reco.titulo.toLowerCase().includes(termino)
    );
  }

  esAdmin(): boolean { return this.SERVICIO_AUTENTICACION.usuario()?.profile === 'admin'; }

  agregarRecordatorio() { this.ROUTER.navigate(['/newReminderPage']); }

  editarRecordatorio(id: string) { this.ROUTER.navigate(['/editReminderPage',id]); }

  eliminarRecordatorio(idNota : string) {
    this.SERVICIO_REECORDATORIO.deleteReminder(idNota).subscribe({
      next : () => this.recordatoriosFiltrados = this.recordatoriosFiltrados.filter(p => p.id !== idNota),
      error : () => this.ALERTA.mostrar("Error al eliminar el recordatorio.", "danger")
    })
  }

  obtenerUsuarios() {
    this.SERVICIO_USUARIOS.getAllUsers().subscribe({
      next : (data: Usuario[]) => this.usuarios = data,
      error : () => this.ALERTA.mostrar('Error al cargar los usuarios.', 'danger')
    })
  }

  obtenerNombreUsuario(idUsuario : string) {
    const usuarioEncontrado = this.usuarios.find(u => u.id === idUsuario);
    return usuarioEncontrado?.username;
  }
}
