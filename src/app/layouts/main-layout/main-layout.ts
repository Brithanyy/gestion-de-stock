import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "../../../Components/footer/footer";
import { Header } from "../../../Components/header/header";
import { Sidebar } from "../../../Components/sidebar/sidebar";
import { Notificacion } from "../../../Components/notificacion/notificacion";
import { Whatsapp } from "../../../Components/whatsapp/whatsapp";
import { ServicioAutenticacion } from '../../../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Footer, Header, Sidebar, Notificacion, Whatsapp, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  readonly SERVICIO_AUTENTICACION = inject(ServicioAutenticacion);

  esAdmin() {
    const usuario = this.SERVICIO_AUTENTICACION.usuario();
    return usuario?.profile === 'admin';
  }
}
