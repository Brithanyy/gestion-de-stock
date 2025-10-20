import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { Alerta } from '../../Services/alerta/alerta';
import { Usuario } from '../../Models/Usuario';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage implements OnInit {

   //*CONSTANTES Y VARIABLES GLOBALES
  readonly formBuilder : FormBuilder = inject(FormBuilder); 

  readonly logoUrl = 'assets/img/logoModerno.png';

  readonly servicioUsuarios = inject(ServicioUsuarios);

  readonly servicioAutenticacion = inject(ServicioAutenticacion);

  readonly alerta : Alerta = inject(Alerta);

    

  usuarios : Usuario[] = [];

  loginForm = this.formBuilder.nonNullable.group({

    'username': ['',[Validators.required]],
    'password': ['',[Validators.required]]
  });

  //*MÉTODOS
  ngOnInit(): void {
    this.listarUsuarios();
  }

  get usernameControl() { return this.loginForm.get('username'); };

  get passwordControl() { return this.loginForm.get('password'); };

  get f() { return this.loginForm.controls; };

  login() {

    if(this.loginForm.valid) {

      const userName = this.loginForm.value.username;
      const nombreString = String(userName);
      const pass = this.loginForm.value.password;
      const passString = String(pass);

      this.servicioAutenticacion.login(nombreString, passString);
    }
  
    else { this.loginForm.markAllAsTouched(); };
  };

  listarUsuarios() {

     this.servicioUsuarios.getAllUsers().subscribe({

      next : (usuariosDevueltos) => { this.usuarios.push(...usuariosDevueltos); },

      error : (error) => { this.alerta.mostrar("Error al cargar los usuarios.", "danger"); }
    });
  };

}
