import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServicioAutenticacion } from '../../Services/autenticacion/servicio-autenticacion';

export const autenticacionGuard: CanActivateFn = (route, state) => {
  
  const auth = inject(ServicioAutenticacion);
  const router = inject(Router);

  if (auth.isLoggedIn() || localStorage.getItem('usuario')) {

    return true;
  } 
  
  else {
    router.navigate(['/auth/loginPage']);
    return false;
  }
};
