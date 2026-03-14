import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-finance-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finance-card.component.html',
  styleUrl: './finance-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceCardComponent {

  title = input<string>('');
  deposit = input<number>(0);
  withdrawal = input<number>(0);
  depositWidth = input<number>(0);
  withdrawalWidth = input<number>(0);
  cardClass = input<string>('bg-light');
}
