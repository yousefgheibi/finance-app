import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: '', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
];
