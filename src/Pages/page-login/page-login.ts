import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Models/Usuario';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Alerta } from '../../Services/alerta/alerta';

@Component({
  selector: 'app-page-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-login.html',
  styleUrl: './page-login.css'
})
export class PageLogin implements OnInit {

  //*Constantes y variables globales
  
  readonly formBuilder : FormBuilder = inject(FormBuilder); 

  readonly logoUrl = 'assets/img/logoModerno.png';

  readonly servicioUsuarios = inject(ServicioUsuarios);

  readonly servicioAutenticacion = inject(ServicioAutenticacion);

  readonly alerta : Alerta = inject(Alerta);

  usuarios = computed(() => this.servicioUsuarios.usuariosSignal());

  loginForm = this.formBuilder.nonNullable.group({

    'username': ['',[Validators.required]],
    'password': ['',[Validators.required]]
  });


  //*Metodos del componente

    ngOnInit(): void {

  }
  
  get usernameControl() {

    return this.loginForm.get('username');
  };

  get passwordControl() {

    return this.loginForm.get('password');
  };

   get f() {

    return this.loginForm.controls;
  };

  login() {

    if(this.loginForm.valid) {

      const userName = this.loginForm.value.username;
      const nombreString = String(userName);
      const pass = this.loginForm.value.password;
      const passString = String(pass);
      this.servicioAutenticacion.login(nombreString, passString);

    }
    
    else {

      this.loginForm.markAllAsTouched();
    };

  };

}
