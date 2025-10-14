import { Routes } from '@angular/router';
import { PageHome } from '../Pages/page-home/page-home';
import { PageLogin } from '../Pages/page-login/page-login';
import { autenticacionGuard } from '../guards/auth/autenticacion-guard';

export const routes: Routes = [
    {
        path: 'home',
        component: PageHome,
        canActivate: [autenticacionGuard]
    },
    {
        path: 'login',
        component: PageLogin
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch:  'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
