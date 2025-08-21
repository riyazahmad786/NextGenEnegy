export interface DateRangeModel {
  ReportType: string;
  FromDate: string;
  EndDate: string;
}

export interface SiteModel {
  UserID: number;
  SiteID: number;
  FacilityID: Number | null;
  LocationID: Number;
}

export interface DateRangeWithSiteModel {
  dateRange: DateRangeModel[]; // List of DateRangeModel objects
  siteModel: SiteModel; // Single SiteModel object
}

export interface ScheduleModel {
  UserID: number;
  SiteID: number;
  FacilityID: Number | null;
  scheduleType: string;
  scheduleTime: string;
  emailId: string;
  selectedDays: string[];
  //selectedMonth: string;
  reports: string[];
  timestamp: string;
  // isReport:number;
  Isshedul: number;
}
