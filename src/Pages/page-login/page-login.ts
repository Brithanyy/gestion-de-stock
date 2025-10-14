import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../Models/Usuario';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';

@Component({
  selector: 'app-page-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-login.html',
  styleUrl: './page-login.css'
})
export class PageLogin implements OnInit{

  ngOnInit(): void {
    this.listaUsuarios();
  }

  readonly formBuilder : FormBuilder = inject(FormBuilder); 

  readonly logoUrl = 'assets/img/logo.png';

  readonly servicioUsuarios = inject(ServicioUsuarios);

  readonly servicioAutenticacion = inject(ServicioAutenticacion);

  loginForm = this.formBuilder.nonNullable.group({
    'username': ['',[Validators.required]],
    'password': ['',[Validators.required]]
  });

  readonly usuarios : Usuario[] = [];

  //Metodos del componente
  
  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

   get f() {
    return this.loginForm.controls;
  }

  listaUsuarios() {
    this.servicioUsuarios.getAllUsers().subscribe({
      next : (usuariosTraidos) => {
        this.usuarios.push(...usuariosTraidos);
      },
      error : (err) => {
        console.error('Error al traer los usuarios:', err) // desp hay que modificar estos errores y hacer un componente para ellos
      }
    })
  }

  login() {
    if(this.loginForm.valid) {
      const userName = this.loginForm.value.username;
      const nombreString = String(userName);
      const pass = this.loginForm.value.password;
      const passString = String(pass);
      this.servicioAutenticacion.login(nombreString, passString);
    }else {
      console.log("Formulario invalido.");
      this.loginForm.markAllAsTouched();
    }
  }

}
