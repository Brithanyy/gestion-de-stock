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
import { EditUserPage } from '../Pages/edit-user-page/edit-user-page';
import { NewUserPage } from '../Pages/new-user-page/new-user-page';
import { EditDrinkPage } from '../Pages/edit-drink-page/edit-drink-page';
import { DetailDrinkPage } from '../Pages/detail-drink-page/detail-drink-page';

export const routes: Routes = [

    { path: '', redirectTo: 'auth/loginPage', pathMatch: 'full' },
    
    {
        path: 'auth',
        component: AuthLayout,
        children: [
        { path: 'loginPage', component: LoginPage },
        { path: '', redirectTo: 'loginPage', pathMatch: 'full' } 
        ]
    },

    {
        path: '',
        component: MainLayout,
        children: [
        { path: 'homePage/:id', component: HomePage/*, canActivate: [autenticacionGuard]*/ },
        { path: 'usersPage', component: UsersPage, canActivate: [autenticacionGuard] },
        { path: 'addDrinkPage', component: AddDrinkPage, canActivate: [autenticacionGuard] },
        { path: 'alertsPage', component: AlertsPage, canActivate: [autenticacionGuard] },
        { path: 'movementsPage', component: MovementsPage, canActivate: [autenticacionGuard] },
        { path: 'reportsPage', component: ReportsPage, canActivate: [autenticacionGuard] },
        { path: 'editUser/:id', component: EditUserPage, canActivate: [autenticacionGuard] },
        { path: 'newUser', component: NewUserPage, canActivate: [autenticacionGuard] },
        { path: 'editDrinkPage/:id', component: EditDrinkPage, canActivate: [autenticacionGuard] },
        { path: 'detailDrinkPage/:id/:idUser', component: DetailDrinkPage, canActivate: [autenticacionGuard] },
        ]
    },

    { path: '**', redirectTo: 'auth/loginPage' }

];
