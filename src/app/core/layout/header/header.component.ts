import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectOption } from '../../../shared/models/option.model';
import { FiscalYearService } from '../../services/fiscal-year.service';
import { GlobalConfig } from '../../config/global-config';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fiscalYearService = inject(FiscalYearService);

  protected pageTitle = signal('');
  protected fiscalYears = signal<SelectOption[]>(GlobalConfig.fiscalYearsOptions);
  protected currentFiscalYear = '';

  ngOnInit() {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'] || '';
        })
      )
      .subscribe(title => {
        this.pageTitle.set(title);
      });

      this.currentFiscalYear = this.fiscalYearService.currentFiscalYear()!;
  }
  
  protected goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  protected updateFiscalYear() {
    this.fiscalYearService.updateFiscalYear(this.currentFiscalYear);
  }

  logout(): void {
    this.authService.logout();
  }
}
