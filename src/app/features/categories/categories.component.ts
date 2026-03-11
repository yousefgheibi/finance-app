import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategoryDto } from '../../core/models/category.model';
import { TableColumn } from '../../shared/models/table.config';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { DataFormComponent } from './data-form/data-form.component';

@Component({
  selector: 'app-categories',
  imports: [TableComponent, TextInputComponent, FormsModule, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {

  private readonly entityService = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly modalService = inject(ModalService);

  protected searchTerm: string = '';
  protected loading = signal(false);
  protected data: ICategoryDto[] = [];
  protected readonly columns: TableColumn[] = [
    { key: 'id', label: 'شناسه', class: 'mw-75px' },
    { key: 'name', label: 'نام دسته‌بندی' },
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
        next: (data: ICategoryDto[]) => {
          this.data = data;
        },
        error: () => {
          this.toastService.error('خطا در دریافت اطلاعات');
        }
      });
  }

  protected deleteCategory(id: number) {
    this.entityService.deleteCategory(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.success(`رکورد '${id}' با موفقیت حذف شد.`);
          this.loadData();
        },
        error: () => {
          this.toastService.error('خطا در حذف رکورد');
        }
      });
  }

  protected openDataFormModal(item?: ICategoryDto) {
    this.modalService.open({
      component: DataFormComponent,
      title: item ? 'ویرایش دسته بندی' : 'افزودن دسته بندی جدید',
      size: 'md',
      data: item,
      afterClose: () => this.loadData()
    })
  }

  protected onSearch() {
    alert('method not implement.')
  }

  protected excelExport() {
    alert('method not implement.')
  }

  protected openFilterModal() {
    alert('method not implement.')
  }
}