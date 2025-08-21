import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartData } from '../../../core/models/model';
@Component({
  selector: 'app-column-chart',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    HighchartsChartModule,
    //CollapsiblePanelComponent,
  ],
  template: `
    <div id="chart-container1">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions1"
        [update]="updateFlag"
        style="width: 100%; height: 300px; display: block;"
      >
      </highcharts-chart>
    </div>
  `,
  styleUrl: './column-chart.component.css',
})
export class ColumnChartComponent implements OnChanges {
  @Input() consumptionData?: ChartData[];
  Highcharts: typeof Highcharts = Highcharts;
  data: ChartData[] = [];
  chart?: Highcharts.Chart;
  updateFlag: any;
  chartOptions1!: Highcharts.Options;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['consumptionData']) {
      if (
        changes['consumptionData'].currentValue !==
        changes['consumptionData'].previousValue
      ) {
        this.data = changes['consumptionData'].currentValue;
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

    const buildings = Array.from(new Set(this.data.map((item) => item.Name)));

    const seriesData = buildings.map((building) => ({
      name: building,
      data: Array(months.length).fill(0), // initialize array for each month
      //color: 'rgb(124,181,236)'
    }));

    // Sum up values per building per month
    this.data.forEach((item) => {
      const index = months.indexOf(item.MonthName); // Adjust for dynamic months array
      const buildingIndex = buildings.indexOf(item.Name);
      seriesData[buildingIndex].data[index] += item.Value;
    });

    // Chart options
    this.chartOptions1 = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Monthly Electricity Consumption ',
      },
      xAxis: {
        categories: months,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'kWh',
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
          '<td style="padding:0"><b>{point.y:.0f} KWh</b></td></tr>',
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
    this.chart = Highcharts.chart('chart-container2', this.chartOptions1);
  }
}
