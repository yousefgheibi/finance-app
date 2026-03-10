import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, ModalComponent, ToastComponent],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    const theme = localStorage.getItem('themeColor') || 'blue';

    document.body.classList.add(`font-${fontSize}`);
    document.body.setAttribute('data-theme', theme);
  }
}
