import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, ModalComponent],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent { }
