import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BsDatepickerModule,
  BsDaterangepickerConfig,
  BsDaterangepickerDirective,
} from 'ngx-bootstrap/datepicker';
//import { DateRangePickerComponent } from '../../../../shared/components/date-range-picker/date-range-picker.component';
//import { ReadonlyDirective } from '../../../../shared/directive/ReadonlyDirective';
import { ToastService } from '../../../../shared/service/toast.service';
import {
  DateRangeModel,
  DateRangeWithSiteModel,
  SiteModel,
} from '../../models/setting';
import { DateRangeService } from '../../services/date-range.service';

@Component({
  selector: 'app-date-range',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,

    // DateRangePickerComponent,
    // ReadonlyDirective,
  ],
  templateUrl: './date-range.component.html',
  styleUrl: './date-range.component.css',
})
export class DateRangeComponent implements OnChanges {
  @Input() siteId?: number;
  @Input() facilityId?: number;
  @Input() userId?: number;
  @Input() locationId?: number;
  @Input() assetId?: number;
  @ViewChild('dp2') dpPicker!: BsDaterangepickerDirective;
  form!: FormGroup;
  bsConfig!: Partial<BsDaterangepickerConfig>;
  bsConfigMonth!: Partial<BsDaterangepickerConfig>;
  bsConfigYear!: Partial<BsDaterangepickerConfig>;
  dailyRange: Date[] = [];
  monthlyRange: Date[] = [];
  yearlyRange: Date[] = [];
  dateRangeModel?: DateRangeModel[];
  isReadonly = true;
  // Declare the hasDailyAssets property
  hasDailyAssets: boolean = false; // Initialize it to false
  isLoading: boolean = false;
  constructor(
    private dateRangeService: DateRangeService,
    private toastService: ToastService
  ) {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.dailyRange;
    this.monthlyRange;
    this.yearlyRange;

    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      adaptivePosition: true,
      displayMonths: 1,
      showTodayButton: true,
      showClearButton: true,
      clearPosition: 'right',
      rangeInputFormat: 'YYYY-MM-DD',
      maxDateRange: 29,
      maxDate: new Date(),
    };

    this.bsConfigMonth = {
      isAnimated: true,
      adaptivePosition: true,
      displayMonths: 1,
      showTodayButton: true,
      showClearButton: true,
      clearButtonLabel: 'Clear',
      rangeInputFormat: 'YYYY-MM-DD',
      maxDateRange: 365,
      maxDate: new Date(),
    };

    this.bsConfigYear = {
      isAnimated: true,
      adaptivePosition: true,
      displayMonths: 1,
      showTodayButton: true,
      showClearButton: true,
      clearButtonLabel: 'Clear',
      rangeInputFormat: 'YYYY-MM-DD',
      maxDate: new Date(),
    };
  }
  getDpPickerReference() {
    return this.dpPicker; // Return the reference to the date picker
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['facilityId']) {
      if (
        changes['facilityId'].currentValue !==
        changes['facilityId'].previousValue
      ) {
        // Clear date ranges when facilityId changes
        this.dailyRange = [];
        this.monthlyRange = [];
        this.yearlyRange = [];
        // Reset siteId to 0 when facilityId changes
        this.siteId = 0;
        if (changes['facilityId'].currentValue > 0) {
          // Fetch new date range based on the new facilityId
          this.getReportSettingDateRange(
            this.userId!,
            changes['facilityId'].currentValue
          );
        }
      }
    }

    if (changes['siteId']) {
      if (changes['siteId'].currentValue !== changes['siteId'].previousValue) {
        if (changes['siteId'].currentValue > 0) {
          this.getReportSettingDateRange(
            this.userId!,
            changes['siteId'].currentValue
          );
        } else {
          this.dailyRange = [];
          this.monthlyRange = [];
          this.yearlyRange = [];
        }
      }
    }
    //swati changes
    // Ensure dpPicker is passed correctly
    const dpPicker = this.getDpPickerReference(); // Implement this method to get the reference to the date picker
    if (changes['facilityId'] || changes['siteId']) {
      this.checkForDailyAssets(
        this.facilityId,
        this.siteId,
        this.userId,
        dpPicker
      );
    }
  }
  checkForDailyAssets(
    facilityId: number | undefined,
    siteId: number | undefined,
    userId: number | undefined,
    dpPicker: { toggle: () => void }
  ): void {
    if (facilityId && siteId && userId) {
      this.isLoading = true; // indicate loading start
      this.dateRangeService
        .getFilteredAssetsByUser(facilityId, siteId, userId)
        .subscribe(
          (response: { Table?: any[] }) => {
            this.isLoading = false; // loading complete

            const dailyAssets = response?.Table || [];
            this.hasDailyAssets = dailyAssets.length > 0;

            // if (this.hasDailyAssets) {
            //   this.toggleDailyCalendar(dpPicker);
            // }
          },
          (error: any) => {
            this.isLoading = false; // loading complete on error
            console.error('Error fetching filtered assets:', error);
            this.hasDailyAssets = false;
            this.toastService.showToast({
              text: 'Failed to fetch daily assets data',
              type: 'error',
            });
            // Do not toggle the calendar on error
          }
        );
    }
  }

  toggleDailyCalendar(dpPicker: { toggle: () => void }): void {
    if (this.hasDailyAssets) {
      dpPicker.toggle();
    } else {
      this.toastService.showToast({
        text: 'Daily data is not imported for this site or location.',
        type: 'warning',
      });
    }
  }

 
  save() {
    this.dateRangeModel = [];
    // Check if the daily range is empty
    const isDailyRangeEmpty = this.dailyRange.length === 0;
    const isMonthlyRangeEmpty = this.monthlyRange.length === 0;
    const isYearlyRangeEmpty = this.yearlyRange.length === 0;

 
    if (isDailyRangeEmpty && isMonthlyRangeEmpty && isYearlyRangeEmpty) {
        this.toastService.showToast({
            text: 'Please fill in at least one date range',
            type: 'error',
        });
        return;
 
    }
    if (
 
        this.facilityId == null ||
        this.siteId == null ||
        this.facilityId == 0 ||
        this.siteId == 0 || 
        this.userId == null ||
        this.userId == 0
    ) {
        this.toastService.showToast({
            text: 'Facility and location are required',
            type: 'warning',
        });
        return;
    }
    if (!isDailyRangeEmpty) {
        const formattedDates = this.dailyRange.map((dateString) =>
            this.formatDate(dateString.toString())
        );
        this.dateRangeModel.push({
            ReportType: 'Daily',
            FromDate: formattedDates[0] + 'T00:59:00',
            EndDate: formattedDates[1] + 'T23:59:59',
        });
    }else {
      // If daily range is empty, set the input UI for daily to null
      this.dailyRange = [];
    }
    if (!isMonthlyRangeEmpty) {
        const formattedDates = this.monthlyRange.map((dateString) =>
            this.formatDate(dateString.toString())
        );
        this.dateRangeModel.push({
            ReportType: 'Month',
            FromDate: formattedDates[0] + 'T00:59:00',
            EndDate: formattedDates[1] + 'T23:59:59',
        });
    }
    if (!isYearlyRangeEmpty) {
        const formattedDates = this.yearlyRange.map((dateString) =>
            this.formatDate(dateString.toString())
        );
        this.dateRangeModel.push({
            ReportType: 'Yearly',
            FromDate: formattedDates[0] + 'T00:59:00',
            EndDate: formattedDates[1] + 'T23:59:59',
        });
 
    }
    if (this.dateRangeModel.length === 0) {
        this.toastService.showToast({
            text: 'Please fill in at least one date range',
            type: 'error',
        });
        return;
    }

    const site: SiteModel = {
        UserID: this.userId!,
        FacilityID: this.facilityId!,
        SiteID: this.siteId!,
        LocationID: this.locationId!,
    };

    const model: DateRangeWithSiteModel = {
        dateRange: this.dateRangeModel,
        siteModel: site,
    };

    this.dateRangeService.postDateRange(model).subscribe(
 
        (response) => {
            console.log('POST success:', response);
            if (this.facilityId && this.siteId) {
               
                this.toastService.showToast({
                    text: 'Date set successfully!',
                    type: 'success', // Assuming 'success' is a valid type in your ToastService
                });
            } else {
                console.log(
                    'Facility or location is null, not showing success message.'
                );
            }
        },
        (error) => {
            console.error('POST error:', error);
          
        }
 
    );
}


  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero indexed
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

 
  getReportSettingDateRange(UserID: number, siteId: number) {
    this.dateRangeService.getDateRange(UserID, siteId).subscribe(
        (response: any) => {
            // Initialize ranges
            this.dailyRange = [];
            this.monthlyRange = [];
            this.yearlyRange = [];

            if (response && response.Table && response.Table.length > 0) {
                this.dateRangeModel = response.Table as DateRangeModel[];
                this.dateRangeModel.forEach((dateRange) => {
                    if (dateRange.ReportType === 'Daily' && dateRange.FromDate && dateRange.EndDate) {
                        this.dailyRange = [
                            new Date(dateRange.FromDate),
                            new Date(dateRange.EndDate),
                        ];
                    } else if (dateRange.ReportType === 'Month' && dateRange.FromDate && dateRange.EndDate) {
                        this.monthlyRange = [
                            new Date(dateRange.FromDate),
                            new Date(dateRange.EndDate),
                        ];
                    } else if (dateRange.ReportType === 'Yearly' && dateRange.FromDate && dateRange.EndDate) {
                        this.yearlyRange = [
                            new Date(dateRange.FromDate),
                            new Date(dateRange.EndDate),
                        ];
                    }
                });
            }
        },
        (error) => {
            // Clear ranges on error
            this.dailyRange = [];
            this.monthlyRange = [];
            this.yearlyRange = [];
            console.error('Error fetching data:', error);
        }
    );
}

}
