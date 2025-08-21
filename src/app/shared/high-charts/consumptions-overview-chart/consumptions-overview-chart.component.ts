import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
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
  selector: 'app-consumptions-overview-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      #chart1
      [series]="chartOptions.series"
      [chart]="chartOptions.chart"
      [xaxis]="chartOptions.xaxis"
      [tooltip]="chartOptions.tooltip"
    >
      >
    </apx-chart>
  `,
  styleUrl: './consumptions-overview-chart.component.css',
})
export class ConsumptionsOverviewChartComponent {
  @ViewChild('chart1') chart1!: ChartComponent;
  @Input() name: string = '';
  @Input() tooltip: string = '';
  @Input() seriesData: any[] = [];
  chartOptions: any = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seriesData']) {
      if (
        changes['seriesData'].currentValue !==
        changes['seriesData'].previousValue
      ) {
        this.seriesData = changes['seriesData'].currentValue;
        if (this.seriesData!.length > 0) {
          this.loadData();
        }
      }
    }
  }
  loadData() {
    this.chartOptions = {
      series: [
        {
          name: this.name,
          data: this.seriesData,
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
        y: {
          // formatter: function (val: number): string {
          //   return `${val} kWh`; // Append 'kWh' to each tooltip value
          // },
          formatter: (
            val: number,
            { series, seriesIndex, dataPointIndex, w }: any
          ) => {
            const unit = this.seriesData[dataPointIndex].unit;
            return `${Math.round(val)} ${unit}`; // Use the unit dynamically
          },
        },
        enabled: true,
      },
    };
  }
}
