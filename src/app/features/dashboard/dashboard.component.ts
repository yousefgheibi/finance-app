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
import { SelectOption } from '../../shared/models/option.model';
import { ICategoryDto } from '../../core/models/category.model';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FinanceCardComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TransactionService, CategoriesService]
})
export class DashboardComponent implements OnInit {

  private readonly transactionService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly fiscalYearService = inject(FiscalYearService);
  private readonly categoryService = inject(CategoriesService);

  protected categoriesType = signal<SelectOption[] | null>(null);
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

  protected transactionsAnnualSummaryChart = computed(() => {
    const filterdTransactions = this.transactionService.getTransactionsAnnualSummary(this.transactions(), Number(this.fiscalYearService.currentFiscalYear()));
    const config: ChartConfig = {
      title: 'گزارش عملکرد ماهانه',
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        datasets: [
          {
            label: 'برداشت',
            data: filterdTransactions.map(item => item.withdrawals),
            color: '#FF6384'
          },
          {
            label: 'واریز',
            data: filterdTransactions.map(item => item.deposits),
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

  protected withdrawalTransactionsFilterByCategoryChart = computed(() => {
    const filterdTransactions = this.transactionService.getWithdrawalTransactionsFilterByCategory(this.transactions(), Number(this.fiscalYearService.currentFiscalYear()));
    const config: ChartConfig = {
      title: 'گزارش برداشت بر اساس دسته‌بندی',
      type: 'doughnut',
      data: {
        labels: Object.keys(filterdTransactions).map(key => this.categoriesType()?.find(c => c.value === key)?.label ?? ''),
        datasets: [
          {
            label: 'برداشت',
            data: Object.values(filterdTransactions)
          }
        ]
      }
    };

    return config;
  });

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
    this.categoryService.loadData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ICategoryDto[]) => {
          this.categoriesType.set(
            data.map((item): SelectOption => (
              { label: item.name, value: String(item.id) }
            )
            ));
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });

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
