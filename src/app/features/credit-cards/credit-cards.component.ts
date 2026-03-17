import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { ExcelService } from '../../core/services/excel.service';
import { ICreditCardDto } from '../../core/models/credit-card.model';
import { TableColumn } from '../../shared/models/table.config';
import { CreditCardService } from '../../core/services/card.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CreditCardDataFormComponent } from './data-form/credit-card-data-form.component';
import { CreditCardPipe } from '../../shared/pipes/credit-card.pipe';

@Component({
  selector: 'app-credit-cards',
  standalone: true,
  imports: [TableComponent, TextInputComponent, FormsModule, CommonModule],
  templateUrl: './credit-cards.component.html',
  styles: '',
  providers: [CreditCardService, CreditCardPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardsComponent implements OnInit {

  private readonly entityService = inject(CreditCardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);
  private readonly excelService = inject(ExcelService);
  private readonly creditCardPipe = inject(CreditCardPipe);

  protected searchTerm: string = '';
  protected loading = signal(false);
  protected data: ICreditCardDto[] = [];
  protected filteredData = signal<ICreditCardDto[]>([]);
  protected readonly columns: TableColumn[] = [
    // { key: 'id', label: 'شناسه', class: 'mw-75px' },
    { key: 'bankName', label: 'نام بانک' , class: 'min-width-100px'},
    { key: 'cardNumber', label: 'شماره کارت', class: 'dir-ltr text-right min-width-165px', formatter: (value: string) => this.creditCardPipe.transform(value) }
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
        next: (data: ICreditCardDto[]) => {
          this.data = data;
          this.filteredData.set(data);
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });
  }

  protected delete(id: number) {
    this.entityService.deleteCard(id)
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

  protected openDataFormModal(item?: ICreditCardDto) {
    this.modalService.open({
      component: CreditCardDataFormComponent,
      title: item ? 'ویرایش کارت' : 'افزودن کارت جدید',
      size: 'md',
      data: item,
      afterClose: () => this.loadData()
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
    this.excelService.exportToCsv(this.filteredData(), 'my-credit-cards');
  }
}