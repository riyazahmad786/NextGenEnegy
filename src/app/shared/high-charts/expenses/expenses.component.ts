import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Summary } from '../../../core/models/model';
import { CollapsiblePanelComponent } from '../../collapsible-panel/collapsible-panel.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    //RouterOutlet,
    CommonModule,
    HighchartsChartModule,
   // CollapsiblePanelComponent,
  ],
  //templateUrl: './expenses.component.html',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 270px; display: block;"
    >
    </highcharts-chart>
  `,
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent implements OnChanges {
  @Input() summaryChatData?: Summary[];
  data: Summary[] = [];
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() type: string = '';

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['summaryChatData']) {
      if (
        changes['summaryChatData'].currentValue !==
        changes['summaryChatData'].previousValue
      ) {
        this.data = changes['summaryChatData'].currentValue;

        this.processData();
      }
    }
  }
  processData() {
    const seriesData = this.data
      .filter((data) => data.Name !== 'Total')
      .map((data) => ({
        name: data.Name,
        y: data.value,
        active: false, // Assuming false for all items// Assuming false for all items
      }));

    this.chartOptions = {
      title: {
        text: this.label,
      },
      plotOptions: {
        pie: {
          shadow: false,
          center: ['50%', '50%'],
          dataLabels: [
            {
              enabled: true,
              distance: -30,
              format: '{point.percentage:.0f} %',
              style: {
                textOutline: 'none',
                color: 'white',
                fontSize: '14px',
              },
            },
            {
              enabled: true,
              distance: 5, // Positive to draw it outside
              format: '{point.y} ',
              style: {
                textOutline: 'none',
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
          //name: this.title,
          name: `Total Consumption ${this.title} `,
          type: 'pie',
          allowPointSelect: true,
          keys: ['name', 'y', 'selected', 'sliced'],
          data: seriesData,
          showInLegend: true,
        },
      ],
    };
  }
}
