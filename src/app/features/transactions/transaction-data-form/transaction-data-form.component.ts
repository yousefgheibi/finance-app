import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITransactionDto } from '../../../core/models/transaction.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SelectOption } from '../../../shared/models/option.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { ICategoryDto } from '../../../core/models/category.model';
import { CreditCardService } from '../../../core/services/card.service';
import { ICreditCardDto } from '../../../core/models/credit-card.model';

@Component({
  selector: 'app-transaction-data-form',
  imports: [ReactiveFormsModule, TextInputComponent, NumberInputComponent, SelectComponent],
  templateUrl: './transaction-data-form.component.html',
  styles: '',
  providers: [TransactionService, CategoriesService, CreditCardService]
})
export class TransactionDataFormComponent implements OnInit {

  protected data = signal(null);
  protected dataForm!: FormGroup;

  protected transactionsType = signal<SelectOption[]>([
    { label: 'خرید', value: 'buy' },
    { label: 'فروش', value: 'sell' }
  ]);

  protected categoriesType = signal<SelectOption[] | null>(null);
  protected creditCardsType = signal<SelectOption[] | null>(null);

  private readonly formbuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly entityService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly categoryService = inject(CategoriesService);
  private readonly creditCardService = inject(CreditCardService);


  ngOnInit(): void {
    this.dataForm = this.formbuilder.group({
      id: [null],
      type: [null, [Validators.required]],
      cardName: [null, [Validators.required]],
      categoryName: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null],
    });

    this.data.set(this.modalService.modalState()?.data);
    if (this.data()) {
      this.dataForm.patchValue(this.data()!);
    }

    this.entityService.initDatabase()
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

  protected loadData() {
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
              { label: item.bankName + item.cardNumber, value: String(item.id) }
            )
            ));
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });
  }

  protected update() {
    const item = {
      ...this.dataForm.getRawValue()
    }
    this.entityService.updateTransaction(item)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.close();
          this.toastService.success(`رکورد '${item.id}' با موفقیت ویرایش شد.`);
        },
        error: () => {
          this.toastService.error('خطا در ویرایش رکورد');
        }
      });
  }

  protected add() {
    const item: ITransactionDto = {
      ...this.dataForm.getRawValue(),
      createdAt: new Date().toISOString()
    }
    this.entityService.addNewTransaction(item)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.close();
          this.toastService.success(`رکورد '${item.id}' با موفقیت ایجاد شد.`);
        },
        error: () => {
          this.toastService.error('خطا در ایجاد رکورد جدید');
        }
      });
  }

  protected close() {
    this.modalService.close();
  }
}
