import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-page-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './page-login.html',
  styleUrl: './page-login.css'
})
export class PageLogin implements OnInit{

  ngOnInit(): void {
    // Aqui va la logica de inicializacion de los usuarios. Es la parte del servicio.
  }
  readonly username = '';
  readonly password = '';

  readonly formBuilder : FormBuilder = inject(FormBuilder); 

  readonly logoUrl = 'assets/img/logo.png';

  loginForm = this.formBuilder.nonNullable.group({
    'username': ['',[Validators.required]],
    'password': ['',[Validators.required,Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')]]
  });

/*Explicacion de los ppatern:
^(?=.*[A-Z])        al menos una letra mayúscula
(?=.*\d)            al menos un número
(?=.*[!@#$%^&*])    al menos un carácter especial permitido
[A-Za-z\d!@#$%^&*]{8,}  solo estos caracteres, mínimo 8
*/
  //Metodos del componente
  onSubmit(): void {
    
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

}
