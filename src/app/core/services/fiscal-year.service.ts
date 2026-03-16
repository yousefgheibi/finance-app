import { computed, effect, Injectable, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class FiscalYearService {

    private _currentFiscalYear = signal(localStorage.getItem('fiscalYear'));
    public currentFiscalYear = computed(() => this._currentFiscalYear());

    private setFiscalYear(fiscalYear: string) {
        this._currentFiscalYear.update(v => fiscalYear);
        localStorage.setItem('fiscalYear', fiscalYear);
    }

    updateFiscalYear(newYear: string) {
        this.setFiscalYear(newYear);
    }
}