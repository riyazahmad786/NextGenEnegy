import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  // stroke: ApexStroke;
  legend: ApexLegend;
  //title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-facility-consumption-overview-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  //templateUrl: './facility-consumption-overview-chart.component.html',
  template: `
    <apx-chart
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
    >
    </apx-chart>
  `,
  styleUrl: './facility-consumption-overview-chart.component.css',
})
export class FacilityConsumptionOverviewChartComponent {
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Week',
          data: [
            {
              x: 'Monday',
              y: 21,
              fillColor: '#008ffb',
            },
            {
              x: 'Tuesday',
              y: 22,
              fillColor: '#00e396',
            },
            {
              x: 'Wednesday',
              y: 10,
              fillColor: '#feb019',
            },
            {
              x: 'Thursday',
              y: 28,
              fillColor: '#ff4560',
            },
            {
              x: 'Friday',
              y: 16,
              fillColor: '#775dd0',
            },
            {
              x: 'Saturday',
              y: 21,
              fillColor: 'rgba(0,143,251,0.85)',
            },
            {
              x: 'Sunday',
              y: 13,
              fillColor: 'rgba(0,227,150,0.85)',
            },
          ],
        },
      ],

      chart: {
        height: 70,
        type: 'bar',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },

      xaxis: {
        type: 'category',

        axisBorder: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '25px',
          borderRadius: 2,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      yaxis: {
        title: {
          text: 'Values',
        },
      },
      fill: {
        colors: [
          '#FF5733',
          '#33FF57',
          '#5733FF',
          '#33FFFF',
          '#FF33FF',
          '#FFFF33',
          '#333333',
        ],
      },
      tooltip: {
        enabled: true,
      },
    };
  }
}
