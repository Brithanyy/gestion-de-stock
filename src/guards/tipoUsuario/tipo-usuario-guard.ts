import { CanActivateFn, Router } from '@angular/router';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';
import { inject } from '@angular/core';

export const tipoUsuarioGuard: CanActivateFn = (route, state) => {

  const servicioAutenticacion: ServicioAutenticacion = inject(ServicioAutenticacion);

  let usuario = servicioAutenticacion.usuario();
  const router = inject(Router);

  if (!usuario) {
  usuario = JSON.parse(localStorage.getItem('usuario')!);
  }
  if(usuario?.profile === 'admin'){
  return true;
  }
  else {
    console.log(usuario?.id)
  router.navigate(['/homePage', usuario?.id]);
  return false;
  }
}
