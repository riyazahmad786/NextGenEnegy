import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartSeries } from '../../../core/models/model';
import { RoundingService } from '../../../core/utils/rounding.service';

@Component({
  selector: 'app-iz-column-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  template: `
    <div [id]="dynamicId">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions1"
        [update]="updateFlag"
        style="width: 100%; height: 270px; display: block;"
      >
      </highcharts-chart>
      <div
        *ngIf="
          !chartOptions1 ||
          !chartOptions1.series ||
          chartOptions1.series.length === 0
        "
        class="no-data-message"
      >
        No data available.
      </div>
    </div>
  `,
  styleUrl: './iz-column-chart.component.css',
})
export class IZColumnChartComponent implements OnChanges {
  constructor(private roundingService: RoundingService) {
    // Generate dynamicId based on some condition or logic
    this.dynamicId = 'chart-container' + Math.floor(Math.random() * 1000);
  }
  dynamicId: string = 'chart-container1';
  @Input() consumptionData?: ChartSeries[];
  Highcharts: typeof Highcharts = Highcharts;
  data: ChartSeries[] = [];
  chart?: Highcharts.Chart;
  updateFlag: any;
  chartOptions1!: Highcharts.Options;
  @Input() seriesData: any[] = [];
  @Input() name?: string;
  @Input() tooltip?: string;
  @Input() tooltipTitle?: string;
  @Input() chartType?: string = 'column';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['consumptionData']) {
      if (
        changes['consumptionData'].currentValue !==
        changes['consumptionData'].previousValue
      ) {
        this.data = changes['consumptionData'].currentValue;
        if (this.data!.length > 0) {
          this.processData();
        } else {
          this.processData();
        }
      }
    }
  }

  processData() {
    // Use meaningful variable names and const for immutable variables
    const uniqueBuildings = [
      ...new Set(this.data.map((item) => item.AssetName)),
    ];
    const uniqueMonths = [...new Set(this.data.map((item) => item.MonthName))];
    const uniqueMonthNumbers = [
      ...new Set(this.data.map((item) => item.DateMonth + '' + item.GetYear)),
    ];

    // Initialize seriesData with proper structure and zeroed data
    const seriesData = uniqueBuildings.map((building) => ({
      name: building,
      data: uniqueMonthNumbers.map(() => 0), // Start with an array of zeros
    }));
    this.tooltipTitle = [...new Set(this.data.map((item) => item.Unit))][0];
    this.tooltip = [...new Set(this.data.map((item) => item.Unit))][0];

    // Use forEach for side-effects, like populating seriesData
    this.data.forEach((item) => {
      const monthIndex = uniqueMonths.indexOf(item.MonthName);
      const buildingIndex = uniqueBuildings.indexOf(item.AssetName);
      if (monthIndex !== -1 && buildingIndex !== -1) {
        seriesData[buildingIndex].data[monthIndex] += item.Value;
      }
    });
    // Chart options
    this.chartOptions1 = {
      chart: {
        type: this.chartType,
      },
      title: {
        text: this.name,
      },
      xAxis: {
        categories: uniqueMonths,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: this.tooltip,
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: 'gray',
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.0f} ' +
          this.tooltipTitle +
          ' </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },

      series: seriesData as Highcharts.SeriesOptionsType[],
    };
    if (this.chart) {
      this.chart.destroy();
    }

    // Initialize new chart
    this.chart = Highcharts.chart(this.dynamicId, this.chartOptions1);
  }
}
