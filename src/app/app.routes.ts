import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./core/core.module').then((m) => m.CoreModule),
    },
    { path: '**', redirectTo: 'error/404' },
];
