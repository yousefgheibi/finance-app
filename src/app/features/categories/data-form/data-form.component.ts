import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../shared/components/text-input/text-input.component';
import { ModalService } from '../../../shared/services/modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ICategoryDto } from '../../../core/models/category.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesService } from '../../../core/services/categories.service';

@Component({
  selector: 'app-data-form',
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './data-form.component.html',
  styles: '',
  providers: [CategoriesService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataFormComponent implements OnInit {

  protected data = signal(null);
  protected dataForm!: FormGroup;

  private readonly formbuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private readonly entityService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);


  ngOnInit(): void {
    this.dataForm = this.formbuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    this.data.set(this.modalService.modalState()?.data);
    if (this.data()) {
      this.dataForm.patchValue(this.data()!);
    }
  }

  protected updateCategory(item: ICategoryDto) {
    this.entityService.updateCategory(item)
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

  protected addNewCategory(item: ICategoryDto) {
    this.entityService.addNewCategory(item)
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
