import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule],
  templateUrl: './app.component.html',
  styles: ''
})
export class AppComponent { }
