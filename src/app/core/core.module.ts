import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { PopoverComponent } from '../shared/components/popover/popover.component';
import { SelectComponent } from "../shared/components/select/select.component";
import { FormsModule } from '@angular/forms';
import { MobileMenuComponent } from './layout/mobile-menu/mobile-menu.component';

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
      },
      {
        path: 'categories',
        loadComponent: () => import('../features/categories/categories.component')
          .then(m => m.CategoriesComponent),
        title: 'دسته بندی‌ها',
        data: { title: 'دسته بندی‌ها' }
      },
      {
        path: 'my-credit-cards',
        loadComponent: () => import('../features/credit-cards/credit-cards.component')
          .then(m => m.CardsComponent),
        title: 'کارت‌های من',
        data: { title: 'کارت‌های من' }
      },
      {
        path: 'my-transactions',
        loadComponent: () => import('../features/transactions/transactions.component')
          .then(m => m.TransactionsComponent),
        title: 'تراکنش‌ها',
        data: { title: 'تراکنش‌ها' }
      }
    ],
  },
];

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent, MobileMenuComponent],
  imports: [
    CommonModule,
    PopoverComponent,
    RouterModule.forChild(routes),
    SelectComponent,
    FormsModule
],
  exports: [LayoutComponent,
    RouterModule]
})
export class CoreModule { }
