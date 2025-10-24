import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Alerta } from '../../Services/alerta/alerta';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoPerfil, Usuario } from '../../Models/Usuario';

@Component({
  selector: 'app-form-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-user.html',
  styleUrls: ['./form-user.css'] 
})
export class FormUser implements OnInit {

  //*CONSTANTES Y VARIABLES GLOBALES

  readonly formBuilder : FormBuilder = inject(FormBuilder); 
  //* Servicio de usuarios
  readonly servicioUsuarios = inject(ServicioUsuarios);

  //*Servicio de alertas
  readonly alerta : Alerta = inject(Alerta);

  readonly router : Router = inject(Router);

  readonly route : ActivatedRoute = inject(ActivatedRoute);

  userId : string | null = null;

  usuarioTraido : Usuario | null = null;

  mostrarPassword: boolean = false;

  readonly userUrl : string = 'assets/img/usuario.png';

  isEditMode = false;
  isAddMode = false;
  
  editUserForm = this.formBuilder.nonNullable.group({
    'username': ['',[Validators.required]],
    'password': ['',[Validators.required]],
    'profile': ['',[Validators.required]]

  });

  newUserForm = this.formBuilder.nonNullable.group({
    'username': ['',[Validators.required]],
    'password': ['',[Validators.required]],
    'profile': ['',[Validators.required]] 
  });

  get usernameControl() { return this.editUserForm.get('username'); };
  get passwordControl() { return this.editUserForm.get('password'); };
  get profileControl() { return this.editUserForm.get('profile'); };

  //*MÉTODOS
  ngOnInit() { 
    this.setearFormulario(); 
    const id = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!id;
    this.isAddMode = !id;
  }
  
   onSubmit() {

    this.userId = this.route.snapshot.paramMap.get('id');

  if (!this.userId || !this.usuarioTraido) {

    this.alerta.mostrar("ID de usuario inválido", "danger");
    return;
  }

  const datosActualizados: Usuario = {

    id: this.userId,
    username: this.editUserForm.value.username!, 
    password: this.editUserForm.value.password!,
    profile: this.editUserForm.value.profile! as TipoPerfil,
    isLoggedIn: this.usuarioTraido.isLoggedIn,
    avatarUrl:  this.usuarioTraido.avatarUrl
  };

  this.servicioUsuarios.putUser(datosActualizados).subscribe({

    next: () => {
      
      this.alerta.mostrar("Usuario actualizado con éxito.", "success");
      this.router.navigate(['/usersPage']);
    },

    error: () => { this.alerta.mostrar("Error al actualizar el usuario.", "danger"); }
    });
  };

  back() { this.router.navigate(['/usersPage']); };

  setearFormulario() {

    this.userId = this.route.snapshot.paramMap.get('id');

    if(this.userId !== null) {

      this.servicioUsuarios.getUser(this.userId).subscribe({

        next : (usuario) => {

          this.usuarioTraido = usuario;
          this.editUserForm.patchValue({
            username : usuario.username,
            password : usuario.password,
            profile : usuario.profile
          });
        },
        error : (err) => { this.alerta.mostrar("Error al cargar el usuario.", "danger"); }
      });
    };
  };

  estoyEnEditar() { return this.isEditMode; };

  estoyEnAgregar() { return this.isAddMode; };

  agregarNuevoUsuario() {

    const nuevoUsuario: Usuario = {

      username: this.newUserForm.value.username!,
      password: this.newUserForm.value.password!,
      profile: this.newUserForm.value.profile! as TipoPerfil,
      isLoggedIn: false,
      avatarUrl: this.userUrl
    };

    this.servicioUsuarios.postUser(nuevoUsuario).subscribe({

      next: () => {
        this.alerta.mostrar("Usuario agregado con éxito.", "success");
        this.router.navigate(['/usersPage']);
      },

      error: () => { this.alerta.mostrar("Error al agregar el usuario.", "danger"); }
    });
  };
}