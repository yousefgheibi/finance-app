import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../shared/services/modal.service';
import { CreditCardService } from '../../../core/services/card.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { ICreditCardDto } from '../../../core/models/credit-card.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-credit-card-data-form',
  imports: [TextInputComponent, ReactiveFormsModule],
  templateUrl: './credit-card-data-form.component.html',
  styles: '',
  providers: [CreditCardService]
})
export class CreditCardDataFormComponent implements OnInit {

  protected data = signal(null);
  protected dataForm!: FormGroup;

  private readonly formbuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly entityService = inject(CreditCardService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.dataForm = this.formbuilder.group({
      id: [null],
      bankName: [null, [Validators.required]],
      cardNumber: [null, [Validators.required]],
    });

    this.data.set(this.modalService.modalState()?.data);
    if (this.data()) {
      this.dataForm.patchValue(this.data()!);
    }
  }

  protected update(item: ICreditCardDto) {
    this.entityService.updateCard(item)
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

  protected add(item: ICreditCardDto) {
    this.entityService.addNewCard(item)
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
