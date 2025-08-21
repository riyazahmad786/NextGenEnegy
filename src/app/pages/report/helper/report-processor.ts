import { RoundingService } from '../../../core/utils/rounding.service';

export class ReportProcessor {
  public years: string[] = [];
  public rows: string[] = [];
  public columns: string[] = [];
  public tableData: Record<string, Record<string, number>> = {};

  constructor(
    private assets: any[],
    private reportType: string,
    private roundingService: RoundingService
  ) {}

  private formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert '0' hour to '12'
    return `${formattedHour} ${suffix}`;
  }

  private getKeyForAsset(asset: any): string {
    switch (this.reportType) {
      case 'Hourly':
        return asset.GetHour;
      case 'Daily':
      case 'DailyCo2':
      case 'MonthlyPeakDemand':
        return `${asset.DateMonth}0${asset.Day}`;
      case 'Monthly':
      case 'MonthlyTrend':
      case 'MonthlyGhG':
      case 'MonthlyCo2':
        return `${asset.GetYear}0${asset.DateMonth}`;
      case 'Yearly':
        return asset.GetYear;
      default:
        return '';
    }
  }

  private getFormattedLabel(asset: any): string {
    switch (this.reportType) {
      case 'Hourly':
        return this.formatHour(asset.GetHour);
      case 'Daily':
      case 'MonthlyPeakDemand':
      case 'DailyCo2':
        return `${asset.Day}/${asset.DateMonth}/${asset.GetYear}`;
      case 'Monthly':
      case 'MonthlyTrend':
      case 'MonthlyGhG':
      case 'MonthlyCo2':
        return `${asset.DateMonth}/${asset.GetYear}`;
      case 'Yearly':
        return `${asset.GetYear}`;
      default:
        return '';
    }
  }

  private updateTableData(asset: any, key: string): void {
    const locationKey =
      this.reportType === 'Yearly' ? asset.LocationName : asset.AssetName;

    if (!this.tableData[locationKey]) {
      this.tableData[locationKey] = {};
    }

    if (asset.Unit === 'kWh/Sq-ft') {
      this.tableData[locationKey][key] = asset.Value;
    } else {
      this.tableData[locationKey][key] =
        this.roundingService.roundToNearestInteger(asset.Value);
    }
  }

  private addRowIfNotExists(key: string): void {
    if (!this.rows.includes(key)) {
      this.rows.push(key);
    }
  }

  private processAsset(asset: any): void {
    const key = this.getKeyForAsset(asset);
    const formattedLabel = this.getFormattedLabel(asset);

    this.updateTableData(asset, key);
    this.addRowIfNotExists(key);

    if (!this.columns.includes(formattedLabel)) {
      this.columns.push(formattedLabel);
    }
  }

  public processData(): void {
    this.assets.forEach((asset) => this.processAsset(asset));
  }
}
