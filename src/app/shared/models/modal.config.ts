import { Type } from '@angular/core';

export interface ModalConfig<T = any> {
    component: Type<T>;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    data?: any;
    afterClose?: (result: any) => void;
}