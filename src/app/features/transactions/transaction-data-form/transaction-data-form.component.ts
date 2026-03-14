import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { TransactionType } from '../../../shared/enums/transaction.enum';

@Component({
  selector: 'app-transaction-data-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, NumberInputComponent, SelectComponent],
  templateUrl: './transaction-data-form.component.html',
  styles: '',
  providers: [TransactionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionDataFormComponent implements OnInit {

  protected data = signal(null);
  protected dataForm!: FormGroup;

  protected transactionsType = signal<SelectOption[]>([
    { label: 'برداشت', value: TransactionType.Withdrawal },
    { label: 'واریز', value: TransactionType.Deposit }
  ]);

  protected categoriesType = signal<SelectOption[] | null>(null);
  protected creditCardsType = signal<SelectOption[] | null>(null);

  private readonly formbuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly entityService = inject(TransactionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.dataForm = this.formbuilder.group({
      id: [null],
      type: [null, [Validators.required]],
      cardName: [null, [Validators.required]],
      categoryName: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null],
      createdAt: [null]
    });

    this.data.set(this.modalService.modalState()?.data?.item);
    if (this.data()) {
      this.dataForm.patchValue(this.data()!);
    }

    this.categoriesType.set(this.modalService.modalState()?.data?.categoriesType);
    this.creditCardsType.set(this.modalService.modalState()?.data?.creditCardsType)
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
          this.toastService.success(`رکورد جدید با موفقیت ایجاد شد.`);
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
