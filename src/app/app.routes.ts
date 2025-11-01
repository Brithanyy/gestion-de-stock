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
import { tipoUsuarioGuard } from '../guards/tipoUsuario/tipo-usuario-guard';
import { ProviderPage } from '../Pages/provider-page/provider-page';
import { EditProviderPage } from '../Pages/edit-provider-page/edit-provider-page';
import { ReminderPage } from '../Pages/reminder-page/reminder-page';
import { EditReminderPage } from '../Pages/edit-reminder-page/edit-reminder-page';
import { NewProviderPage } from '../Pages/new-provider-page/new-provider-page';
import { NewReminderPage } from '../Pages/new-reminder-page/new-reminder-page';

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
        { path: 'homePage/:id', component: HomePage, canActivate: [autenticacionGuard] },
        { path: 'usersPage', component: UsersPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'addDrinkPage', component: AddDrinkPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'alertsPage', component: AlertsPage, canActivate: [autenticacionGuard] },
        { path: 'movementsPage', component: MovementsPage, canActivate: [autenticacionGuard] },
        { path: 'reportsPage', component: ReportsPage, canActivate: [autenticacionGuard] },
        { path: 'editUser/:id', component: EditUserPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'newUser', component: NewUserPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'editDrinkPage/:id', component: EditDrinkPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'detailDrinkPage/:id/:idUser', component: DetailDrinkPage, canActivate: [autenticacionGuard] },
        { path: 'providerPage', component: ProviderPage, canActivate: [autenticacionGuard] },
        { path: 'newProviderPage', component: NewProviderPage, canActivate: [autenticacionGuard] },
        { path: 'editProviderPage/:id', component: EditProviderPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        { path: 'reminderPage', component: ReminderPage, canActivate: [autenticacionGuard] },
        { path: 'newReminderPage', component: NewReminderPage, canActivate: [autenticacionGuard] },
        { path: 'editReminderPage/:id', component: EditReminderPage, canActivate: [autenticacionGuard, tipoUsuarioGuard] },
        ]
    },

    { path: '**', redirectTo: 'auth/loginPage' }

];
