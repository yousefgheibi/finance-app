import { Component } from '@angular/core';

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
  protected readonly navItems: NavItem[] = [
    { path: '/dashboard', icon: 'fa-tv', label: 'داشبورد' },
    { path: '/transactions', icon: 'fa-credit-card', label: 'تراکنش‌ها' },
    { path: '/categories', icon: 'fa-list-alt', label: 'دسته بندی‌ها' },
    { path: '/reminders', icon: 'fa-calendar', label: 'یادآوری‌ها و اعلان‌ها' },
    { path: '/settings', icon: 'fa-cog', label: 'تنظیمات' },
  ];
}
