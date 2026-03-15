import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FinanceCardComponent } from '../../shared/components/finance-card/finance-card.component';
import { Period } from '../../shared/enums/period.enum';
import { TransactionType } from '../../shared/enums/transaction.enum';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionSummary } from '../../core/models/transaction-summary.model';
import { ITransactionDto } from '../../core/models/transaction.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';
import { ChartComponent } from "../../shared/components/chart/chart.component";
import { ChartConfig } from '../../shared/models/chart.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FinanceCardComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransactionService]
})
export class DashboardComponent implements OnInit {

  private readonly transactionService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  private transactions = signal<ITransactionDto[]>([]);

  protected financeCards = computed(() => {
    const periods = [
      { title: 'امروز', period: Period.Today, cardClass: 'bg-light-blue card' },
      { title: '1 روز گذشته', period: Period.Yesterday, cardClass: 'bg-light-green card' },
      { title: '7 روز گذشته', period: Period.Week, cardClass: 'bg-light-yellow card' },
      { title: '30 روز گذشته', period: Period.Month, cardClass: 'bg-light-purple card' }
    ];

    const withdrawalTotals = [
      this.getSummary(TransactionType.Withdrawal, Period.Today).total,
      this.getSummary(TransactionType.Withdrawal, Period.Yesterday).total,
      this.getSummary(TransactionType.Withdrawal, Period.Week).total,
      this.getSummary(TransactionType.Withdrawal, Period.Month).total
    ];

    const depositTotals = [
      this.getSummary(TransactionType.Deposit, Period.Today).total,
      this.getSummary(TransactionType.Deposit, Period.Yesterday).total,
      this.getSummary(TransactionType.Deposit, Period.Week).total,
      this.getSummary(TransactionType.Deposit, Period.Month).total
    ];

    const maxDepositTotal = Math.max(...depositTotals);
    const maxWithdrawalTotal = Math.max(...withdrawalTotals);

    return periods.map(p => {
      const deposit = this.getSummary(TransactionType.Deposit, p.period);
      const withdrawal = this.getSummary(TransactionType.Withdrawal, p.period);

      return {
        title: p.title,
        cardClass: p.cardClass,
        depositTotal: deposit.total,
        depositWidth: Math.min((deposit.total / maxDepositTotal) * 100, 100),
        withdrawalTotal: withdrawal.total,
        withdrawalWidth: Math.min((withdrawal.total / maxWithdrawalTotal) * 100, 100)
      };
    });
  });

  protected monthlyChart: ChartConfig = {
    title: 'گزارش عملکرد ماهانه',
    type: 'line',
    data: {
      labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      datasets: [
        {
          label: 'برداشت',
          data: [100, 200, 150, 300, 250, 400, 350, 500, 450, 600, 550, 700],
          color: '#FF6384'
        },
        {
          label: 'واریز',
          data: [180, 180, 120, 280, 20, 380, 320, 880, 620, 480, 220, 680],
          color: '#7BBA9F'
        }
      ]
    },
    options: {
      responsive: true,
      unit: 'تومان'
    }
  };

  protected categoryChart: ChartConfig = {
    title: 'گزارش تفکیک شده بر اساس دسته‌بندی',
    type: 'pie',
    data: {
      labels: ['نانوایی', 'آشپزی', 'لوازم', 'تفریح', 'سایر', 'حقوق', 'سرمایه‌گذاری', 'سایر'],
      datasets: [
        {
          label: 'برداشت',
          data: [100, 200, 150, 300, 250, 400, 350, 500]
        },
        {
          label: 'واریز',
          data: [180, 180, 120, 280, 20, 380, 320, 880]
        }
      ]
    }
  };

  ngOnInit(): void {
    this.transactionService.initDatabase()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: () => {
          this.toastService.error('خطا در ارتباط با دیتابیس');
        }
      });
  }

  private loadData() {
    this.transactionService.loadData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ITransactionDto[]) => {
          this.transactions.set(data);
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });
  }

  private getSummary(type: TransactionType, period: Period): TransactionSummary {
    const items = this.transactions();
    const now = new Date();

    const filtered = items.filter(item => {
      if (item.type !== type) return false;
      const date = new Date(item.createdAt);

      switch (period) {
        case Period.Today:
          return date.toDateString() === now.toDateString();

        case Period.Yesterday:
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          return date.toDateString() === yesterday.toDateString();

        case Period.Week:
          const lastWeek = new Date();
          lastWeek.setDate(now.getDate() - 7);
          return date >= lastWeek && date <= now;

        case Period.Month:
          const lastMonth = new Date();
          lastMonth.setMonth(now.getMonth() - 1);
          return date >= lastMonth && date <= now;

        default:
          return false;
      }
    });

    return {
      total: filtered.reduce((sum, t) => sum + Number(t.price), 0),
      count: filtered.length
    };
  }
}
