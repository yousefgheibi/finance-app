import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-transactions',
  imports: [TableComponent, TextInputComponent, FormsModule],
  templateUrl: './transactions.component.html',
  styles: '',
  providers: [TransactionService]
})
export class TransactionsComponent implements OnInit {

  private readonly entityService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);
  private readonly excelService = inject(ExcelService);

  protected searchTerm: string = '';
  protected loading = signal(false);
  protected data: ITransactionDto[] = [];
  protected filteredData = signal<ITransactionDto[]>([]);
  protected readonly columns: TableColumn[] = [
    { key: 'type', label: 'نوع' },
    { key: 'categoryName', label: 'دسته‌بندی' },
    { key: 'price', label: 'مبلغ' },
    { key: 'cardName', label: 'شماره کارت' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'description', label: 'توضیحات' }
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

  protected loadData() {
    this.entityService.loadData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ITransactionDto[]) => {
          this.data = data;
          this.filteredData.set(data);
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
    throw new Error('Method not implemented.');
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
    this.excelService.exportToCsv(this.filteredData(), 'categories');
  }

}
