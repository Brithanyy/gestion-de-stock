import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../Services/usuarios/servicio-usuarios';
import { Alerta } from '../../Services/alerta/alerta';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoPerfil, Usuario } from '../../Models/Usuario';
import { firstValueFrom } from 'rxjs';

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
  submitting = false;
  
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
  
  async agregarNuevoUsuario() {
    if (this.newUserForm.invalid) {
      this.alerta.mostrar('Completa el formulario correctamente.', 'danger');
      return;
    }

    const username = (this.newUserForm.value.username || '').toString().trim();
    const password = this.newUserForm.value.password || '';
    const profile = this.newUserForm.value.profile! as TipoPerfil;

    if (!username) {
      this.alerta.mostrar('El nombre de usuario es requerido.', 'danger');
      return;
    }

    this.submitting = true;
    try {
      const usuarios = await firstValueFrom(this.servicioUsuarios.getAllUsers());
      const existe = usuarios.some(u => (u.username ?? '').toString().trim().toLowerCase() === username.toLowerCase());

      if (existe) {
        this.alerta.mostrar('Ya existe un usuario con ese nombre.', 'danger');
        return;
      }

      const nuevoUsuario: Usuario = {
        username,
        password,
        profile,
        isLoggedIn: false,
        avatarUrl: this.userUrl
      };

      await firstValueFrom(this.servicioUsuarios.postUser(nuevoUsuario));
      this.alerta.mostrar('Usuario agregado con éxito.', 'success');
      this.router.navigate(['/usersPage']);
    } catch (err) {
      console.error(err);
      this.alerta.mostrar('Error al agregar el usuario.', 'danger');
    } finally {
      this.submitting = false;
    }
  }

  async editarUsuario() {
    if (this.editUserForm.invalid) {
      this.alerta.mostrar('Completa el formulario correctamente.', 'danger');
      return;
    }

    const id = this.userId;
    if (!id) {
      this.alerta.mostrar('Usuario no identificado para editar.', 'danger');
      return;

    }
    const username = (this.editUserForm.value.username || '').toString().trim();
    const password = this.editUserForm.value.password || '';
    const profile = this.editUserForm.value.profile! as TipoPerfil;

    this.submitting = true;
    try {
      const usuarios = await firstValueFrom(this.servicioUsuarios.getAllUsers());
      // comprobar duplicado excluyendo el propio id
      const existe = usuarios.some(u =>
        u.id !== id && (u.username ?? '').toString().trim().toLowerCase() === username.toLowerCase()
      );

      if (existe) {
        this.alerta.mostrar('Ya existe otro usuario con ese nombre.', 'danger');
        return;
      }

      const actualizado: Usuario = {
        id,
        username,
        password,
        profile,
        avatarUrl: this.usuarioTraido?.avatarUrl ?? this.userUrl,
        isLoggedIn: this.usuarioTraido?.isLoggedIn ?? false
      };

      await firstValueFrom(this.servicioUsuarios.putUser(actualizado));
      this.alerta.mostrar('Usuario actualizado con éxito.', 'success');
      this.router.navigate(['/usersPage']);
    } catch (err) {
      console.error(err);
      this.alerta.mostrar('Error al actualizar el usuario.', 'danger');
    } finally {
      this.submitting = false;
    }
  }


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
  
}