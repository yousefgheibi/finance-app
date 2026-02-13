import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from './header/header.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      }
    ],
  },
];

@NgModule({
  declarations: [LayoutComponent, SidebarComponent,FooterComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
],
  exports: [LayoutComponent,
    RouterModule]
})
export class CoreModule { }
