import { Component } from '@angular/core';
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
  protected readonly navItems: NavItem[] = GlobalConfig.menuItems.sort((a, b) => a.order - b.order);
}
