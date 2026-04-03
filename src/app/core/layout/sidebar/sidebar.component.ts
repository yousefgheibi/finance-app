import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GlobalConfig } from '../../config/global-config';

export interface NavItem {
  path: string;
  icon: string;
  label: string;
  order: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  private readonly authService = inject(AuthService);
  protected readonly navItems: NavItem[] = GlobalConfig.menuItems.sort((a,b)=> a.order - b.order);

  logout(): void {
    this.authService.logout();
  }
}
