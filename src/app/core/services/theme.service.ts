import { computed, Injectable, signal } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class ThemeServcie {

    // Theme
    private _currentTheme = signal(localStorage.getItem('themeColor'));
    public currentTheme = computed(() => {
        document.body.setAttribute('data-theme', this._currentTheme()!);
        return this._currentTheme();

    });

    private isValidTheme(theme: string): boolean {
        return ['blue', 'green', 'red'].includes(theme);
    }

    private setTheme(theme: string) {
        if (this.isValidTheme(theme)) {
            this._currentTheme.update(v => theme);
            localStorage.setItem('themeColor', theme);
        }
    }

    updateTheme(theme: string) {
        this.setTheme(theme);
    }


    // Font Size
    private _currentFontSize = signal(localStorage.getItem('fontSize'));
    public currentFontSize = computed(() => {
        document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
        document.body.classList.add(`font-${this._currentFontSize()}`);
        return this._currentFontSize();
    });


    private setFontSize(size: string) {
        this._currentFontSize.update(v => size);
        localStorage.setItem('fontSize', size);
    }

    updateFontSize(size: string) {
        this.setFontSize(size)
    }
}