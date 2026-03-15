import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfig } from '../../models/chart.config';
import { FontSpec } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent {

  private font: Partial<FontSpec> = {
    family: 'Vazirmatn',
    size: 14
  };

  config = input.required<ChartConfig>();

  chartData = computed(() => ({
    labels: this.config().data.labels,
    datasets: this.config().data.datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: ds.color
    }))
  }));

  chartOptions = computed(() => ({
    ...this.config().options,
    plugins: {
      ...this.config().options?.plugins,
      legend: {
        labels: {
          font: this.font
        }
      },
      tooltip: {
        titleFont: this.font,
        bodyFont: this.font
      }
    },
    scales: this.config().type === 'pie' ? {} : {
      x: {
        ticks: {
          font: this.font
        }
      },
      y: {
        ticks: {
          font: this.font,
          callback: this.config().options?.unit
            ? (value: string | number) => `${value} ${this.config().options!.unit}`
            : undefined

        }
      }
    }
  }));

}