import { ChartConfiguration, ChartType } from 'chart.js';

export interface ChartDataset {
    label: string;
    data: number[];
    color?: string;
}

export interface ChartConfig {
    type: ChartType;
    title?: string;
    data: {
        labels: string[];
        datasets: ChartDataset[];
    };
    options?: ChartConfiguration['options'] & {
        unit?: string;
    };
}