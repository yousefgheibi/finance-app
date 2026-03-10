import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { PopoverComponent } from '../shared/components/popover/popover.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'داشبورد',
        data: { title: 'داشبورد' }
      },
      {
        path: 'profile',
        loadComponent: () => import('../features/profile/profile.component')
          .then(m => m.ProfileComponent),
        title: 'پروفایل کاربری',
        data: { title: 'پروفایل کاربری' }
      }
    ],
  },
];

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
  imports: [
    CommonModule,
    PopoverComponent,
    RouterModule.forChild(routes)
],
  exports: [LayoutComponent,
    RouterModule]
})
export class CoreModule { }
