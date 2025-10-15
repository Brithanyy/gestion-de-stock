import { Component, computed, inject, OnInit } from '@angular/core';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit{

  readonly servicioAutenticacion : ServicioAutenticacion = inject(ServicioAutenticacion);

  usuario = this.servicioAutenticacion.usuario;
  nombreUsuario = computed(() => this.usuario()?.username);
  tipoUsuario = computed(() => this.usuario()?.profile);
  logueado = computed(() => this.servicioAutenticacion.isLoggedIn());

  ngOnInit(): void { //Para que sea responsive y configurar el boton de hamburguesa.
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
  }
}

  logOut() {
    if(this.logueado()) {
      this.servicioAutenticacion.logOut();
    }
  }




}
