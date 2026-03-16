import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
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
import { FiscalYearService } from '../../core/services/fiscal-year.service';
import { TransactionAnnualSummary } from '../../core/models/transaction-annual-summary.model';

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
  private readonly fiscalYearService = inject(FiscalYearService);

  private transactions = signal<ITransactionDto[]>([]);

  protected financeCards = computed(() => {
    const periods = [
      { title: 'امروز', period: Period.Today, cardClass: 'bg-light-blue card' },
      { title: '1 روز گذشته', period: Period.Yesterday, cardClass: 'bg-light-green card' },
      { title: '7 روز گذشته', period: Period.Week, cardClass: 'bg-light-yellow card' },
      { title: '30 روز گذشته', period: Period.Month, cardClass: 'bg-light-purple card' }
    ];

    const withdrawalTotals = [
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Withdrawal, Period.Today).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Withdrawal, Period.Yesterday).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Withdrawal, Period.Week).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Withdrawal, Period.Month).total
    ];

    const depositTotals = [
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Deposit, Period.Today).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Deposit, Period.Yesterday).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Deposit, Period.Week).total,
      this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Deposit, Period.Month).total
    ];

    const maxDepositTotal = Math.max(...depositTotals);
    const maxWithdrawalTotal = Math.max(...withdrawalTotals);

    return periods.map(p => {
      const deposit = this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Deposit, p.period);
      const withdrawal = this.transactionService.getTransactionSummary(this.transactions(), TransactionType.Withdrawal, p.period);

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

  protected monthlyChart = computed(() => {
    const config: ChartConfig = {
      title: 'گزارش عملکرد ماهانه',
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        datasets: [
          {
            label: 'برداشت',
            data: this.transactionService.getTransactionAnnualSummary(this.transactions(), Number(this.fiscalYearService.currentFiscalYear())).map(item => item.withdrawals),
            color: '#FF6384'
          },
          {
            label: 'واریز',
            data: this.transactionService.getTransactionAnnualSummary(this.transactions(), Number(this.fiscalYearService.currentFiscalYear())).map(item => item.deposits),
            color: '#7BBA9F'
          }
        ]
      },
      options: {
        responsive: true,
        unit: 'تومان'
      }
    };

    return config;
  });

  protected categoryChart: ChartConfig = {
    title: 'گزارش تفکیک شده بر اساس دسته‌بندی',
    type: 'doughnut',
    data: {
      labels: ['نانوایی', 'آشپزی', 'لوازم', 'تفریح', 'سایر', 'حقوق', 'سرمایه‌گذاری', 'سایر'],
      datasets: [
        {
          label: 'برداشت',
          data: [100, 200, 150, 300, 250, 400, 350, 500]
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
}
