export class DateHandler {
  seriesData: { Day: number; DateMonth: number; GetYear: number }[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  type: string | null = null;
  constructor(
    seriesData: { Day: number; DateMonth: number; GetYear: number }[],
    type: string
  ) {
    this.seriesData = seriesData;
    this.type = type;
    this.setStartAndEndDate();
  }

  private setStartAndEndDate() {
    if (this.seriesData.length === 0) {
      console.error('No dates available to set start and end dates.');
      return;
    }

    let dateObjects: Date[] = [];

    switch (this.type) {
      case 'Hourly':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, item.Day)
        );
        break;
      case 'Daily':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, item.Day)
        );
        break;
      case 'Monthly':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      case 'MonthlyGhG':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      case 'DailyCo2':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, item.Day)
        );
        break;
      case 'MonthlyCo2':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      case 'Yearly':
      case 'YearlyAgainstBudget':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, 0, 1)
        );
        break;
      case 'MonthlyTrend':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      case 'MonthlyAgainstBudget':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      case 'MonthlyPeakDemand':
        dateObjects = this.seriesData.map(
          (item) => new Date(item.GetYear, item.DateMonth - 1, 1)
        );
        break;
      default:
        console.error('Inval3id type:', this.type);
        return;
    }

    this.startDate = new Date(
      Math.min(...dateObjects.map((date) => date.getTime()))
    );
    this.endDate = new Date(
      Math.max(...dateObjects.map((date) => date.getTime()))
    );
  }
  public getDateFormat(type: string): string {
    const dateFormats: { [key: string]: string } = {
      Hourly: 'yyyy-MMM-dd',
      Daily: 'yyyy-MMM-dd',
      Monthly: 'yyyy-MMM',
      MonthlyGhG: 'yyyy-MMM',
      MonthlyTrend: 'yyyy-MMM',
      DailyCo2: 'yyyy-MMM-dd',
      MonthlyCo2: 'yyyy-MMM',
      MonthlyAgainstBudget: 'yyyy-MMM',
      MonthlyPeakDemand: 'yyyy-MMM',
    };
    return dateFormats[type] ?? 'yyyy-MMM-dd';
  }
}
