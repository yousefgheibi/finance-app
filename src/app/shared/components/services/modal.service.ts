import { Injectable, signal } from '@angular/core';
import { ModalConfig } from '../../models/modal-config';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    modalState = signal<ModalConfig | null>(null);

    open<T>(config: ModalConfig<T>) {
        this.modalState.set(config);
    }

    close() {
        this.modalState.set(null);
    }

}