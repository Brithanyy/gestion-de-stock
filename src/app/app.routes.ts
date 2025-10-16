import { Routes } from '@angular/router';
import { autenticacionGuard } from '../guards/auth/autenticacion-guard';
import { LoginPage } from '../Pages/login-page/login-page';
import { HomePage } from '../Pages/home-page/home-page';
import { UsersPage } from '../Pages/users-page/users-page';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { AddDrinkPage } from '../Pages/add-drink-page/add-drink-page';
import { AlertsPage } from '../Pages/alerts-page/alerts-page';
import { MovementsPage } from '../Pages/movements-page/movements-page';
import { ReportsPage } from '../Pages/reports-page/reports-page';

export const routes: Routes = [

    {
        path: '',
        component: MainLayout,
        children: [

            { path: '', redirectTo: 'homePage', pathMatch: 'full'  },
            { path: 'homePage', component: HomePage, canActivate: [autenticacionGuard] },
            { path: 'usersPage', component: UsersPage, canActivate: [autenticacionGuard] },
            { path: 'addDrinkPage', component: AddDrinkPage, canActivate: [autenticacionGuard] },
            { path: 'alertsPage', component: AlertsPage },
            { path: 'movementsPage', component: MovementsPage },
            { path: 'reportsPage', component: ReportsPage },
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
