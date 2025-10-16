import { Routes } from '@angular/router';
import { autenticacionGuard } from '../guards/auth/autenticacion-guard';
import { LoginPage } from '../Pages/login-page/login-page';
import { HomePage } from '../Pages/home-page/home-page';
import { UsersPage } from '../Pages/users-page/users-page';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [

    {
        path: '',
        component: MainLayout,
        children: [

            { path: '', redirectTo: 'homePage', pathMatch: 'full'  },
            { path: 'homePage', component: HomePage, canActivate: [autenticacionGuard] },
            { path: 'usersPage', component: UsersPage, canActivate: [autenticacionGuard] }
            // otras rutas que usan header/sidebar/footer
        ]
    },

    {
        path: 'auth',
        component: AuthLayout,
        children: [
        { path: 'loginPage', component: LoginPage },
        { path: '', redirectTo: 'loginPage', pathMatch: 'full' }
        ]
    },

    {
        path: '**',
        redirectTo: 'homePage'
    }
];
