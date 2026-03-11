import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    exportToCsv(data: any[], fileName: string): void {
        if (!data || !data.length) return;

        const keys = Object.keys(data[0]);
        const csvContent = [
            keys.join(','),
            ...data.map(row => keys.map(k => this.formatValue(row[k])).join(','))
        ].join('\r\n');

        this.downloadCsv(csvContent, fileName);
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) return '';
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
    }

    private downloadCsv(csv: string, fileName: string): void {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}