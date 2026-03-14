import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { SelectOption } from '../../../shared/models/option.model';
import { ModalService } from '../../../shared/services/modal.service';
import { JalaliDatePickerComponent } from "../../../shared/components/jalali-date-picker/jalali-date-picker.component";

@Component({
  selector: 'app-transactions-filter',
  standalone: true,
  imports: [ReactiveFormsModule, NumberInputComponent, SelectComponent, JalaliDatePickerComponent],
  templateUrl: './transactions-filter.component.html',
  styles: ''
})
export class TransactionsFilterComponent implements OnInit {

  protected data = signal(null);
  protected filterForm!: FormGroup;

  protected transactionsType = signal<SelectOption[]>([
    { label: 'برداشت', value: 'withdraw' },
    { label: 'واریز', value: 'deposit' }
  ]);

  protected categoriesType = signal<SelectOption[] | null>(null);
  protected creditCardsType = signal<SelectOption[] | null>(null);

  private readonly formbuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);

  ngOnInit(): void {
    this.filterForm = this.formbuilder.group({
      type: [null],
      cardName: [null],
      categoryName: [null],
      fromPrice: [null],
      toPrice: [null],
      fromDate: [null],
      toDate: [null],
    });

    this.data.set(this.modalService.modalState()?.data?.item);
    if (this.data()) {
      this.filterForm.patchValue(this.data()!);
    }

    this.categoriesType.set(this.modalService.modalState()?.data?.categoriesType);
    this.creditCardsType.set(this.modalService.modalState()?.data?.creditCardsType)
  }

  protected close() {
    this.modalService.close(null);
  }

  protected filter() {
    this.modalService.close(this.filterForm.getRawValue());
  }
}
