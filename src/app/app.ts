import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd  } from '@angular/router';
import { PageLogin } from "../Pages/page-login/page-login";
import { ServicioAutenticacion } from '../Services/autenticacion/servicio-autenticacion';
import { CommonModule } from '@angular/common';
import { Alertas } from "../Components/alertas/alertas";
import { filter } from 'rxjs';
import { BarraLateral } from "../Components/barra-lateral/barra-lateral";
import { NavBar } from "../Components/nav-bar/nav-bar";
import { Footer } from "../Components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [Alertas, RouterOutlet, BarraLateral, NavBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  //*Constantes y variables globales
  protected readonly title = signal('gestion-de-stock');
  readonly router : Router = inject(Router);

  isLoginPage : boolean = false;

  //*Métodos
  ngOnInit(): void {
    
    //Hacemos esto para que cuando estes en la loginPage no te muestre el header, sidebar y footer, ya que están puestos en el html raíz
    this.router.events

      .pipe(filter(event => event instanceof NavigationEnd))

      .subscribe((event: any) => {
        this.isLoginPage = event.urlAfterRedirects === '/login';
      });
    
  };


}
