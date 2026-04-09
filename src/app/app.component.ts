import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeServcie } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, ModalComponent, ToastComponent],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent {
  private readonly themeService = inject(ThemeServcie);

  constructor() {
    if(!this.themeService.currentTheme()){
      this.themeService.updateTheme('blue');
      this.themeService.updateFontSize('font-medium');
    }
    effect(() =>{
      this.themeService.currentTheme();
      this.themeService.currentFontSize();
    })
  }
}
