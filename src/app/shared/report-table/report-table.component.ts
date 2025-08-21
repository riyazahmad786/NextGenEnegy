import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableData } from '../../core/models/model';
import { ReportType } from '../../core/models/types';
import { RoundingService } from '../../core/utils/rounding.service';
import { ReportProcessor } from '../../pages/report/helper/report-processor';
import { ObjectKeysPipe } from '../pipes/object-keys.pipe';
import { RoundingPipe } from '../pipes/rounding.pipe';

@Component({
  selector: 'app-report-table',
  standalone: true,
  templateUrl: './report-table.component.html',
  styleUrl: './report-table.component.css',
  imports: [CommonModule, ObjectKeysPipe, 
    /*RoundingPipe*/],
})
export class ReportTableComponent implements OnChanges {
  @Input() assets: any[] = [];
  @Input() reportType: ReportType = 'Hourly';
  rows: string[] = [];
  columns: string[] = [];
  tableData: any = {};

  constructor(private roundingService: RoundingService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assets']) {
      if (changes['assets'].currentValue !== changes['assets'].previousValue) {
        this.assets = changes['assets'].currentValue;
        if (this.assets!.length > 0) {
          //this.tableData= this.assets;
          this.processData();
        }
      }
    }
  }

  hasData(data: TableData): boolean {
    return Object.keys(data).length > 0;
  }

  processData() {
    this.rows = [];
    this.columns = [];
    this.tableData = {};
    const reportProcessor = new ReportProcessor(
      this.assets,
      this.reportType,
      this.roundingService
    );
    reportProcessor.processData();
    this.rows = reportProcessor.rows;
    this.columns = reportProcessor.columns;
    this.tableData = reportProcessor.tableData;
  }
}
