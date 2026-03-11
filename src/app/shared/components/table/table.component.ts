import { CommonModule } from '@angular/common';
import { Component, computed, contentChild, input, signal, TemplateRef } from '@angular/core';
import { PopoverComponent } from '../popover/popover.component';
import { TableColumn } from '../../models/table.config';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PopoverComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  loading = input<boolean>(true);
  pageSize = input<number>(10);

  actionsTemplate = contentChild<TemplateRef<any>>('actions');
  currentPage = signal(1);

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.data().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.ceil(this.data().length / this.pageSize())
  );

  changePage(page: number) {
    this.currentPage.set(page);
  }

  formatValue(col: any, row: any) {
    const value = row[col.key];
    return col.formatter ? col.formatter(value, row) : value;
  }
}