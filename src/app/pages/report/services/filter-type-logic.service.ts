import { Injectable } from '@angular/core';
import { ReportType } from '../../../core/models/types';
import { AppStateService } from '../../../shared/service/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class FilterTypeLogicService {
  constructor(private appState: AppStateService) {}

  getFilterType(): ReportType {
    // Use a more concise and efficient approach using a set for membership checking
    const validTypes = new Set([
      'Hourly',
      'Daily',
      'Monthly',
      'Yearly',
      'MonthlyCo2',
      'DailyCo2',
      'MonthlyTrend',
      'MonthlyGhG',
      'MonthlyPeakDemand',
      'MonthlyAgainstBudget',
      'YearlyAgainstBudget',
    ]);

    const type = this.appState.getParameter('reportType');
    return validTypes.has(type) ? type : 'Hourly'; // Default fallback
  }
}
