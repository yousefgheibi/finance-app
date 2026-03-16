import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  private readonly authService = inject(AuthService);
  protected readonly navItems: NavItem[] = [
    { path: '/dashboard', icon: 'fa-tv', label: 'داشبورد' },
    { path: '/my-transactions', icon: 'fa-file-invoice', label: 'تراکنش‌ها' },
    { path: '/categories', icon: 'fa-list-alt', label: 'دسته بندی‌ها' },
    { path: '/my-credit-cards', icon: 'fa-credit-card', label: 'کارت‌های من' },
    { path: '/profile', icon: 'fa-user-circle', label: 'تنظیمات' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
