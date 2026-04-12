import { Component } from '@angular/core';
import { NavItem } from '../sidebar/sidebar.component';
import { GlobalConfig } from '../../config/global-config';

@Component({
  selector: 'app-mobile-menu',
  standalone: false,
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss'
})
export class MobileMenuComponent {
  
    protected readonly navItems: NavItem[] = GlobalConfig.mobileMenuItems.sort((a,b)=> a.order - b.order);
}
