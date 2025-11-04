import { Component, inject, OnInit } from '@angular/core';
import { ServicioProveedor } from '../../Services/proveedores/servicio-proveedor';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Router } from '@angular/router';
import { Proveedor } from '../../Models/Proveedor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alertas } from '../../Components/alertas/alertas';
import { Alerta } from '../../Services/alerta/alerta';

@Component({
  selector: 'app-provider-page',
  imports: [CommonModule, FormsModule], 
  templateUrl: './provider-page.html',
  styleUrl: './provider-page.css'
})
export class ProviderPage implements OnInit {
  readonly SERVICIO_PROVEEDORES = inject(ServicioProveedor);
  readonly SERVICIO_AUTENTICACION = inject(ServicioAutenticacion);
  readonly ROUTER = inject(Router);
  readonly ALERTA = inject(Alerta);

  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  terminoBusqueda: string = '';

  ngOnInit() {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.SERVICIO_PROVEEDORES.getAllProvider().subscribe({
      next: (data: Proveedor[]) => {
        this.proveedores = data;
        this.proveedoresFiltrados = [...data];
      },
      error: () => this.ALERTA.mostrar('Error al cargar proveedores', 'danger')
    });
  }

  filtrarProveedores() {
    const termino = this.terminoBusqueda.toLowerCase();
    this.proveedoresFiltrados = this.proveedores.filter(prov =>
      prov.nombre.toLowerCase().includes(termino)
    );
  }

  esAdmin(): boolean { return this.SERVICIO_AUTENTICACION.usuario()?.profile === 'admin'; }

  agregarProveedor() { this.ROUTER.navigate(['/newProviderPage']); }

  editarProveedor(id: string) { this.ROUTER.navigate(['/editProviderPage',id]); }

  contactarProveedor(telefono: string) {
    const url = `https://wa.me/${telefono.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  }

  eliminarProveedor(id : string | undefined) {
    this.SERVICIO_PROVEEDORES.deleterovider(id).subscribe({
      next : () => {
        this.proveedoresFiltrados = this.proveedoresFiltrados.filter(p => p.id !== id);
      },
      error : () => {
        this.ALERTA.mostrar("Error al eliminar el proveedor.", "danger");
      }
    })
  }
}
