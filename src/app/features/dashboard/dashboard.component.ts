import { Component } from '@angular/core';
import { NumberInputComponent } from '../../shared/components/number-input/number-input.component';

@Component({
  selector: 'app-dashboard',
  imports: [NumberInputComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
