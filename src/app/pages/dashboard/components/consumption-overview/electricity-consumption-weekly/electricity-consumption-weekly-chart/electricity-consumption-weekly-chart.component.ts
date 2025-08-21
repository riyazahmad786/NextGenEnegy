import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { Facility } from '../../../../../../core/models/facility';
import { FacilityCommunicationService } from '../../../../services/facility-communication.service';
import { FacilityDashboardService } from '../../../../services/facility-dashboard.service';
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
  selector: 'app-electricity-consumption-weekly-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  template: `
    <apx-chart
      #chart1
      [series]="chartOptions1.series"
      [chart]="chartOptions1.chart"
      [xaxis]="chartOptions1.xaxis"
      [tooltip]="chartOptions1.tooltip"
    >
      >
    </apx-chart>
  `,
  styleUrl: './electricity-consumption-weekly-chart.component.css',
})
export class ElectricityConsumptionWeeklyChartComponent implements OnInit {
  @ViewChild('chart1') chart1!: ChartComponent;
  @Input() facilitiesData?: Facility;
  chartOptions1: any = {};
  data: any[] = [];
  summaryData: any[] = [];
  seriesData: any[] = [];
  constructor(
    private facilityService: FacilityDashboardService,
    private communicationService: FacilityCommunicationService
  ) {
    //this.loadData();
  }

  ngOnInit() {
    this.communicationService.reloadChart$.subscribe(({ fid, userID }) => {
      this.loadFacilities(fid, 1);
    });
    //this.loadFacilities(1,1);
    this.loadFacilities(this.facilitiesData?.FacilitiesID!, 1);
  }

  loadFacilities(fId: number, uId: number): void {
    this.data = [];
    this.facilityService.GetElectricityConsumptionWeekly(fId, uId).subscribe(
      (data: any[]) => {
        this.data = (data as any).Table;
        this.seriesData = this.data.map((item, index) => ({
          x: this.getDayOfWeek(index), // Assuming the third column represents x-values (days)
          y: item.Value, // Assuming the first column represents y-values
          fillColor: this.getRandomColor(index), // Generate random color for each data point
        }));
        console.log('Processed Electricity series data:', this.seriesData);
        this.loadData();
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getDayOfWeek(dayNumber: number): string {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[dayNumber]; // Adjust for array index
  }

  getRandomColor(dayNumber: number): string {
    const daysOfWeek = [
      '#008ffb',
      '#00e396',
      '#feb019',
      '#ff4560',
      '#775dd0',
      'rgba(0,143,251,0.85)',
      'rgba(0,227,150,0.85)',
    ];
    return daysOfWeek[dayNumber];
  }

  loadData() {
    console.log(this.seriesData);
    this.chartOptions1 = {
      series: [
        {
          name: 'Electricity Consumption',
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
          formatter: function (val: number): string {
            return `${val} kWh`; // Append 'kWh' to each tooltip value
          },
        },
        enabled: true,
      },
    };
  }
}
