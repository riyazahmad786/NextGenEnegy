import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';

import * as Highcharts from 'highcharts';
import { SummaryEntry, TableEntry } from '../../../../core/models/model';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
@Component({
  selector: 'app-facility-column-chart',
  standalone: true,
  imports: [
   // RouterOutlet,
    CommonModule,
    HighchartsChartModule,
   // SpinnerComponent,
  ],
  // templateUrl: './facility-column-chart.component.html',
  template: `
    <div id="chart-container1">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        [update]="updateFlag"
        style="width: 100%; height: 300px; display: block;"
      >
      </highcharts-chart>
    </div>
  `,
  styleUrl: './facility-column-chart.component.css',
})
export class FacilityColumnChartComponent implements OnChanges, AfterViewInit {
  chart?: Highcharts.Chart;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  @Input() chartData?: TableEntry[];
  updateFlag: any;
  data: TableEntry[] = [];
  summaryData: SummaryEntry[] = [];

  constructor() {}
  ngAfterViewInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData']) {
      if (
        changes['chartData'].currentValue !== changes['chartData'].previousValue
      ) {
        this.data = changes['chartData'].currentValue;
        if (this.data!.length > 0) {
          this.processData();
        }
      }
    }
  }

  processData() {
    // Extract unique month names
    const monthSet = new Set(this.data.map((item) => item.MonthName));
    let months = Array.from(monthSet);

    // Define a type for the month keys
    type MonthKey =
      | 'Jan'
      | 'Feb'
      | 'Mar'
      | 'Apr'
      | 'May'
      | 'Jun'
      | 'Jul'
      | 'Aug'
      | 'Sep'
      | 'Oct'
      | 'Nov'
      | 'Dec';

    // Define a custom sort function for month names
    const monthOrder: { [key in MonthKey]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    months = months.sort((a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      const dateA = new Date(
        parseInt(yearA, 10),
        monthOrder[monthA as MonthKey]
      );
      const dateB = new Date(
        parseInt(yearB, 10),
        monthOrder[monthB as MonthKey]
      );
      return dateA.getTime() - dateB.getTime();
    });

    const buildings = Array.from(
      new Set(this.data.map((item) => item.BuildingName))
    );

    const seriesData = buildings.map((building) => ({
      name: building,
      data: Array(months.length).fill(0), // initialize array for each month
      //color: 'rgb(124,181,236)'
    }));

    // Sum up values per building per month
    this.data.forEach((item) => {
      const index = months.indexOf(item.MonthName); // Adjust for dynamic months array
      const buildingIndex = buildings.indexOf(item.BuildingName);
      seriesData[buildingIndex].data[index] += item.SumTotalValue;
    });

    // Chart options
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Monthly Electricity Expenses',
      },
      xAxis: {
        categories: months,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'USD($)',
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
          '<td style="padding:0"><b>{point.y:.0f} USD($)</b></td></tr>',
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
    this.chart = Highcharts.chart('chart-container', this.chartOptions);
  }
}
