import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Summary } from '../../../core/models/model';

@Component({
  selector: 'app-consumption',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  // templateUrl: './consumption.component.html',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 270px; display: block;"
    >
    </highcharts-chart>
  `,
  styleUrl: './consumption.component.css',
})
export class ConsumptionComponent implements OnChanges, AfterViewInit {
  @Input() summaryData?: Summary[];
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() type: string = '';

  data: Summary[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngAfterViewInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['summaryData']) {
      this.data = changes['summaryData'].currentValue;
      this.processData();
    }
  }
  processData() {
    const seriesData = this.data
      .filter((data) => data.Name !== 'Total')
      .map((data) => ({
        name: data.Name,
        y: data.value,
        active: false, // Assuming false for all items
      }));
    this.chartOptions = {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
        },
      },
      title: {
        text: this.label,
      },
      plotOptions: {
        pie: {
          innerSize: 50,
          depth: 55,
          dataLabels: [
            {
              enabled: true,
              distance: -22, // Negative to draw it inside
              format: '{point.percentage:.0f} %',
              style: {
                textOutline: 'none',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
              },
            },
            {
              enabled: true,
              distance: 15, // Positive to draw it outside
              format: '{point.y}',
              style: {
                textOutline: 'none',
                opacity: 0.8,
                color: 'black',
                fontSize: '12px',
              },
              connectorShape: 'crookedLine', // Shape of the connector line
              connectorWidth: 1, // Width of the connector line
              softConnector: true,
            },
          ],
        },
      },
      series: [
        {
          keys: ['name', 'y', 'selected', 'sliced'],
          allowPointSelect: true,
          type: 'pie',
          name: 'Total Expenses USD $',
          showInLegend: true,
          data: seriesData,
        },
      ] as Highcharts.SeriesOptionsType[],
    };
  }
}
// plotOptions: {
//   pie: {
//     innerSize: 100,
//     depth: 45,
//     dataLabels: {
//       distance: -30,
//       format: '{point.percentage:.1f} %'
//   }
//   }
// },
// series: [{
//   name: 'Total Expenses USD $',
//   data: seriesData
// }] as Highcharts.SeriesOptionsType[]
