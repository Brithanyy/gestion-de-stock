import { Component, computed, inject, OnInit } from '@angular/core';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES
  public readonly servicioAutenticacion : ServicioAutenticacion = inject(ServicioAutenticacion);
  readonly ROUTER : Router = inject(Router);

  usuario = this.servicioAutenticacion.usuario;
  nombreUsuario = computed(() => this.usuario()?.username);
  tipoUsuario = computed(() => this.usuario()?.profile);
  logueado = computed(() => this.servicioAutenticacion.isLoggedIn());

  //*MÉTODOS
  ngOnInit(): void { 
  
    //Para que sea responsive y configurar el boton de hamburguesa.
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('active'));
  }

  logOut() { if(this.logueado()) this.servicioAutenticacion.logOut(); };


}
