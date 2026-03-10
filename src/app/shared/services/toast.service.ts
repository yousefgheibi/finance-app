import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.model';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private _toasts = signal<Toast[]>([]);
    private counter = 0;

    toasts = this._toasts.asReadonly();

    show(message: string, type: Toast['type'] = 'info', duration = 3000) {
        const id = ++this.counter;
        const toast: Toast = { id, message, type, duration };
        this._toasts.update(current => [...current, toast]);

        setTimeout(() => this.remove(id), duration);
    }

    remove(id: number) {
        this._toasts.update(current => current.filter(t => t.id !== id));
    }

    success(msg: string, duration?: number) { this.show(msg, 'success', duration); }
    error(msg: string, duration?: number) { this.show(msg, 'error', duration); }
    info(msg: string, duration?: number) { this.show(msg, 'info', duration); }
    warning(msg: string, duration?: number) { this.show(msg, 'warning', duration); }
}