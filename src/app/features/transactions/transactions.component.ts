import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../shared/models/table.config';
import { ITransactionDto } from '../../core/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { ExcelService } from '../../core/services/excel.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TransactionDataFormComponent } from './transaction-data-form/transaction-data-form.component';
import { PersianDatePipe } from '../../shared/pipes/persian-date.pipe';
import { SelectOption } from '../../shared/models/option.model';
import { ICategoryDto } from '../../core/models/category.model';
import { ICreditCardDto } from '../../core/models/credit-card.model';
import { CategoriesService } from '../../core/services/categories.service';
import { CreditCardService } from '../../core/services/card.service';
import { TransactionsFilterComponent } from './transactions-filter/transactions-filter.component';
import { TransactionType } from '../../shared/enums/transaction.enum';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [TableComponent, TextInputComponent, FormsModule],
  templateUrl: './transactions.component.html',
  styles: '',
  providers: [TransactionService, PersianDatePipe, CategoriesService, CreditCardService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {

  private readonly entityService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);
  private readonly excelService = inject(ExcelService);
  private readonly persianDatePipe = inject(PersianDatePipe);
  private readonly categoryService = inject(CategoriesService);
  private readonly creditCardService = inject(CreditCardService);

  private filterFormData = signal<any>(null);
  protected categoriesType = signal<SelectOption[] | null>(null);
  protected creditCardsType = signal<SelectOption[] | null>(null);

  protected searchTerm: string = '';
  protected loading = signal(false);
  protected data: ITransactionDto[] = [];
  protected filteredData = signal<ITransactionDto[]>([]);
  protected readonly columns: TableColumn[] = [
    { key: 'type', label: 'نوع', class: 'min-w-100px',formatter: (value: string) => value == TransactionType.Withdrawal ? 'برداشت' : 'واریز' },
    { key: 'categoryName', label: 'دسته‌بندی', class: 'min-w-100px', formatter: (value: string) => this.categoriesType()?.find(c => c.value === value)?.label ?? '' },
    { key: 'price', label: 'مبلغ',class: 'min-w-175px', formatter: (value: string) => Number(value).toLocaleString() + ' تومان' },
    { key: 'cardName', label: 'شماره کارت',class: 'min-w-200px', formatter: (value: string) => this.creditCardsType()?.find(c => c.value === value)?.label ?? '' },
    { key: 'createdAt', label: 'تاریخ ایجاد',class: 'min-w-150px dir-ltr text-right', formatter: (value: string) => this.persianDatePipe.transform(value, 'datetime') },
    { key: 'description', label: 'توضیحات',class: 'min-w-100px', formatter: (value: string) => value ?? '-' }
  ];

  ngOnInit(): void {
    this.loading.set(true);
    this.entityService.initDatabase()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.loadData();
        },
        error: () => {
          this.toastService.error('خطا در ارتباط با دیتابیس');
        }
      });
  }

  protected loadData(filter?: any) {
    this.entityService.loadData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ITransactionDto[]) => {
          this.data = data;
          this.filteredData.set(filter ? data.filter(item => this.matchesFilter(item, filter)) : data);
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });

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

    this.creditCardService.loadData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ICreditCardDto[]) => {
          this.creditCardsType.set(
            data.map((item): SelectOption => (
              { label: `${item.bankName} - ${item.cardNumber}`, value: String(item.id) }
            )
            ));
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });
  }

  protected delete(id: number) {
    this.entityService.deleteTransaction(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success(`رکورد '${id}' با موفقیت حذف شد.`);
          this.loadData();
          this.onSearch();
        },
        error: () => {
          this.toastService.error('خطا در حذف رکورد');
        }
      });
  }

  protected openDataFormModal(item?: ITransactionDto) {
    this.modalService.open({
      component: TransactionDataFormComponent,
      title: item ? 'ویرایش تراکنش' : 'افزودن تراکنش جدید',
      size: 'md',
      data: {
        item: item,
        categoriesType: this.categoriesType(),
        creditCardsType: this.creditCardsType()
      },
      afterClose: () => this.loadData()
    })
  }

  protected openFilterModal() {
    this.modalService.open({
      component: TransactionsFilterComponent,
      title: 'جستجوی پیشرفته',
      size: 'xl',
      data: {
        item: this.filterFormData(),
        categoriesType: this.categoriesType(),
        creditCardsType: this.creditCardsType()
      },
      afterClose: (result) => {
        const filter = result && Object.keys(result).length ? result : null;
        
        this.filterFormData.set(filter);
        this.loadData(filter ?? undefined);
      }
    })
  }

  protected onSearch() {
    const term = this.searchTerm.toLowerCase();

    this.filteredData.set(
      this.data.filter(item =>
        Object.values(item).some(value => String(value).toLowerCase().includes(term))
      ));
  }

  protected excelExport() {
    this.toastService.info('شروع دریافت خروجی اکسل');
    this.excelService.exportToCsv(this.filteredData(), 'transactions');
  }

  private matchesFilter(item: ITransactionDto, filter: any): boolean {

    if (filter.type && item.type !== filter.type) return false;
    if (filter.categoryName && item.categoryName !== filter.categoryName) return false;
    if (filter.cardName && item.cardName !== filter.cardName) return false;

    if (filter.fromDate && new Date(item.createdAt) < new Date(filter.fromDate)) return false;
    if (filter.toDate && new Date(item.createdAt) > new Date(filter.toDate)) return false;

    if (filter.fromPrice && item.price < filter.fromPrice) return false;
    if (filter.toPrice && item.price > filter.toPrice) return false;

    return true;
  }
}
