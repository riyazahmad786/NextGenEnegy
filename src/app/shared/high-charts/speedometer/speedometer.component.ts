import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import { SummaryEntry } from '../../../core/models/model';

highchartsMore(Highcharts);
solidGauge(Highcharts);

@Component({
  selector: 'app-speedometer',
  standalone: true,
  imports: [ CommonModule, HighchartsChartModule],
  //templateUrl: './speedometer.component.html',
  template: `
    <div [id]="dynamicId" style="width: 100%; height: 270px;">
      <highcharts-chart
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        [update]="updateFlag"
        style="width: 100%; height: 270px; display: block;"
      ></highcharts-chart>
    </div>
  `,
  styleUrl: './speedometer.component.css',
})
export class SpeedometerComponent implements OnInit, OnChanges {
  constructor() {
    // Generate dynamicId based on some condition or logic
    this.dynamicId = 'chart-container' + Math.floor(Math.random() * 1000);
  }
  dynamicId: string = 'chart-container1';

  @Input() summaryChatData?: SummaryEntry;
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() type: string = '';
  @Input() values: number = 0;
  @Input() id: string = '';
  data: SummaryEntry[] = [];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  chart?: Highcharts.Chart;
  updateFlag: any;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['label'] || changes['values']) {
      this.processData(this.values!);
    } else {
      this.processData(0);
    }
  }

  processData(newSpeed: number) {
    this.chart?.redraw();
    this.chartOptions = {
      chart: {
        type: 'gauge',
        plotBackgroundColor: '',
        plotBackgroundImage: '',
        plotBorderWidth: 0,
        plotShadow: false,
      },
      title: {
        text: 'Total ' + this.label,
      },
      pane: {
        startAngle: -150,
        endAngle: 150,
        background: [
          {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#FFF'],
                [1, '#333'],
              ],
            },
            borderWidth: 0,
            outerRadius: '109%',
          },
          {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#333'],
                [1, '#FFF'],
              ],
            },
            borderWidth: 1,
            outerRadius: '107%',
          },
          {
            // default background
          },
          {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%',
          },
        ],
      },
      // the value axis
      yAxis: {
        min: 0,
        max: 200000,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
          formatter: function () {
            return (this.value as number) / 1000 + 'k';
          },
          step: 2,
          rotation: 0,
        },
        title: {
          text: this.title,
        },

        plotBands: [
          { from: 0, to: 80000, color: '#55BF3B' }, // Green up to 120k
          { from: 80000, to: 160000, color: '#DDDF0D' }, // Yellow from 120k to 160k
          { from: 160000, to: 200000, color: '#DF5353' }, // Red from 160k to 200k
        ],
      },
      series: [
        {
          name: this.label,
          data: [this.values],
          tooltip: {
            valueSuffix: this.title,
          },
        },
      ] as Highcharts.SeriesOptionsType[],
    };
    if (this.chart) {
      this.chart.destroy();
    }
    // Initialize new chart
    this.chart = Highcharts.chart(this.dynamicId, this.chartOptions);
  }
}
