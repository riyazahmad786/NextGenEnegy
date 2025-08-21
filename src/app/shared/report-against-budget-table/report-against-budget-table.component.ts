import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TemplateService } from '../../../app/pages/report/download/services/template.service';

@Component({
  selector: 'app-report-against-budget-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-against-budget-table.component.html',
  styleUrl: './report-against-budget-table.component.css',
})
export class ReportAgainstBudgetTableComponent {
  @Input() assets: any[] = [];
  @Input() periodStartDate: any = new Date();
  @Input() periodEndDate: any = new Date();

  constructor(private templateService: TemplateService) {}

  generateReport() {
    // Assuming `TemplateService` is injected via constructor and available
    this.templateService.downloadHtmlFile(
      this.assets,
      this.assets, // Assuming you're passing the same data for table
      'MonthlyAgainstBudget',
      'Facility Name',
      'Location Name',
      this.formatDate(this.periodEndDate), // Passing formatted date
      'Report Name',
      this.formatDate(this.periodStartDate), // Passing formatted date
      'line',
      'unitType',
      'Floor Name',
      'Username',

      10, // maxLine
      'FTimezone'
    );
  }

  // Helper method to format date as needed (e.g., 'YYYY-MM-DD')
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // Formats date as 'YYYY-MM-DD'
  }
}
