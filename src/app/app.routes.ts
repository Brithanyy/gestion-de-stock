import { Routes } from '@angular/router';
import { PageHome } from '../Pages/page-home/page-home';
import { PageLogin } from '../Pages/page-login/page-login';

export const routes: Routes = [
    {
        path: 'home',
        component: PageHome
    },
    {
        path: 'login',
        component: PageLogin
    }
];
