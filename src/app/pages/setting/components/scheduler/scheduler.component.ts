import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';
import { ToastService } from '../../../../shared/service/toast.service';
import { ScheduleModel } from '../../models/setting';
import { DateRangeService } from '../../services/date-range.service';
import { SchedulerService } from '../../services/scheduler.service';

@Component({
  selector: 'app-scheduler',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css',
})
export class SchedulerComponent implements OnInit {
  @Input() siteId?: number;
  @Input() facilityId?: number;
  @Input() userId?: number;
  selectpickerOpen: boolean = false;
  dropdownOpen: boolean = false;
  isSaveClicked: boolean = false;
  emailId: string = '';
  selectedType: string = 'Select';
  ScheduleChecked: boolean = false;
  daily: string[] = [''];
  weekdays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  monthlyOptions: { label: string }[] = [
    { label: 'Start of month' },
    { label: 'Mid of month' },
  ];

  scheduleTime: string = '';
  selectedDays: string[] = [];
  facilityName: string = '';
  locationName: string = '';
  userName: string = '';
  isReport: number = 0;
  Isshedul: number = 1;
  timeZone: string = '';
  reports: string[] = [];
  selectedReports: string[] = [];

  constructor(
    private schedulerService: SchedulerService,
    private toastService: ToastService,
    private storageService: StorageService,
    private DateRangeService: DateRangeService
  ) {
    // document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnInit(): void {
    if (
      this.userId !== undefined &&
      this.siteId !== undefined &&
      this.facilityId !== undefined
    ) {
      this.emailId = this.storageService.getUserEmailId();
      //document.addEventListener('click', this.handleClickOutside.bind(this));

      //this.toggleDropdown();
      //this.toggleSelectpicker();
      this.handleNoScheduleData(
        this.userId,
        this.siteId,
        this.facilityId,
        this.selectedType
      );
      this.getScheduleReportByUser(
        this.userId,
        this.siteId,
        this.facilityId,
        this.selectedType
      );
    }
  }

  ngOnDestroy() {
    if (
      this.userId !== undefined &&
      this.siteId !== undefined &&
      this.facilityId !== undefined
    ) {
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] || changes['siteId'] || changes['facilityId']) {
      this.isSaveClicked = false;
      document.addEventListener('click', this.handleClickOutside.bind(this));
      if (
        this.userId !== undefined &&
        this.siteId !== undefined &&
        this.facilityId !== undefined
      ) {
        //  this.toggleDropdown();
        this.toggleSelectpicker();

        this.handleNoScheduleData(
          this.userId,
          this.siteId,
          this.facilityId,
          this.selectedType
        );
        this.getScheduleReportByUser(
          this.userId,
          this.siteId,
          this.facilityId,
          this.selectedType
        );
      }
    }
  }
  toggleDropdown(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent immediate closing
    }
    this.dropdownOpen = !this.dropdownOpen;
  }
  // toggleDropdown() {
  //   this.dropdownOpen = !this.dropdownOpen;
  // }
  toggleSelectpicker() {
    this.selectpickerOpen = !this.selectpickerOpen;
  }
  // Method to check if the date range is set
  isDateRangeSet(
    userId: number,
    siteId: number,
    facilityId: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.DateRangeService.getDateRange(userId, siteId).subscribe(
        (response: any) => {
          if (response && response.Table && response.Table.length > 0) {
            resolve(true); // Date range is set
          } else {
            resolve(false); // Date range is not set
          }
        },
        (error) => {
          console.error('Error fetching date range:', error);
          reject(false); // Handle error case
        }
      );
    });
  }

  onShedulChange(event: any) {
    this.ScheduleChecked = event.target.checked;
    //this.ScheduleChecked = true;
    if (!this.ScheduleChecked) {
      this.selectedType = 'Select';
    }
  }

  onSelectType(event: any) {
    this.selectedType = event.target.value;
    console.log('Selected Type:', this.selectedType);
    this.selectedDays = [];
    this.handleNoScheduleData(
      this.userId,
      this.siteId,
      this.facilityId,
      this.selectedType
    );
  }
  onSelectDay(day: string, event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = this.selectedDays.filter((d) => d !== day);
    }

    //console.log('Selected Days:', this.selectedDays);
  }

  onSelectMonth(month: string, event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      if (!this.selectedDays.includes(month)) {
        this.selectedDays.push(month);
      }
    } else {
      this.selectedDays = this.selectedDays.filter((m) => m !== month);
    }
    //console.log('Selected Month:', this.selectedDays);
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isOutsideWeeklyDropdown = !target.closest('.weekly-dropdown');
    const isOutsideMonthlyDropdown = !target.closest('.monthly-dropdown');
    const isDropdownToggle = target.closest('.dropdown-toggle');

    // Only close if click is outside AND not on the toggle button
    if (
      isOutsideWeeklyDropdown &&
      isOutsideMonthlyDropdown &&
      !isDropdownToggle
    ) {
      this.dropdownOpen = false;
    }
  }

  saveSchedule() {
    this.isSaveClicked = true;

    // Check if ScheduleChecked is true
    if (!this.ScheduleChecked) {
      this.toastService.showToast({
        text: 'Please check the schedule before saving.',
        type: 'error',
      });
      return;
    }

    if (
      this.userId === undefined ||
      this.siteId === undefined ||
      this.facilityId === undefined
    ) {
      this.toastService.showToast({
        text: 'User  ID, Site ID, and Facility ID must be defined.',
        type: 'warning',
      });
      return;
    }

    // Check if scheduleTime is set
    if (!this.scheduleTime) {
      this.toastService.showToast({
        text: 'Time is required before saving the schedule.',
        type: 'warning',
      });
      return;
    }
    // Check if a schedule type is selected
    if (this.selectedType === 'Select') {
      this.toastService.showToast({
        text: 'Please select a schedule type before saving.',
        type: 'warning',
      });
      return;
    }
    if (
      (this.selectedType === 'Weekly' || this.selectedType === 'Monthly') &&
      this.selectedDays.length === 0
    ) {
      this.toastService.showToast({
        text: 'Please select at least one day for the schedule.',
        type: 'warning',
      });
      return;
    }
    if (!this.emailId) {
      this.toastService.showToast({
        text: 'Email ID is required before saving the schedule.',
        type: 'warning',
      });
      return;
    }
    const emailPattern: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co|info|org|net|edu|gov|mil)$/;
    const validateEmails = (emailString: string): boolean => {
      const emails: string[] = emailString
        .split(',')
        .map((email) => email.trim());
      for (const email of emails) {
        if (!emailPattern.test(email)) {
          this.toastService.showToast({
            text: 'Please enter valid email IDs',
            type: 'warning',
          });
          return false;
        }
        // Check for multiple occurrences of the same TLD
        const tldMatch = email.match(/\.([a-zA-Z]{2,})$/);
        if (tldMatch && email.split(tldMatch[0]).length - 1 > 1) {
          this.toastService.showToast({
            text: 'Please enter valid email IDs',
            type: 'warning',
          });
          return false;
        }
      }
      return true;
    };
    if (!validateEmails(this.emailId)) {
      return; // Exit if validation fails
    }
    // Check if date range is set for the selected facility and location
    this.isDateRangeSet(this.userId, this.siteId, this.facilityId)
      .then((isSet) => {
        if (!isSet) {
          this.toastService.showToast({
            text: 'Facility, location and date range are required fields for scheduling',
            type: 'warning',
          });
          return;
        }

        this.getSelectedReports().then((selectedReports) => {
          if (selectedReports.length === 0) {
            this.toastService.showToast({
              text: 'Please select at least one report to schedule',
              type: 'error',
            });
            return;
          }

          const scheduleModel: ScheduleModel = {
            UserID: this.userId!,
            SiteID: this.siteId!,
            FacilityID: this.facilityId!,
            scheduleType: this.selectedType,
            scheduleTime: this.scheduleTime,
            emailId: this.emailId,
            selectedDays: this.selectedDays,
            reports: selectedReports,
            timestamp: new Date().toISOString(),
            Isshedul: this.Isshedul,
          };
          this.schedulerService.logScheduleData(scheduleModel);
          // if (this.siteId === undefined) {

          this.schedulerService.saveSchedule(scheduleModel).subscribe(
            (response) => {
              this.toastService.showToast({
                text: 'Schedule saved successfully',
                type: 'success',
              });
              this.clearFormFields(); // Clear the form after saving
            },
            (error) => {
              this.toastService.showToast({
                text: 'Error saving schedule',
                type: 'error',
              });
            }
          );
          //}
        });
      })
      .catch((error) => {
        console.error('Error checking date range:', error);
      });
  }

  handleNoScheduleData(
    userId: number | undefined,
    siteId: number | undefined,
    facilityId: number | undefined,
    selectedType: string
  ): void {
    if (
      userId !== undefined &&
      siteId !== undefined &&
      facilityId !== undefined
    ) {
      this.schedulerService
        .getSchedule(userId, siteId, facilityId)
        .subscribe((response: any) => {
          if (Array.isArray(response.Table)) {
            const scheduleData = response.Table.filter(
              (data: any) =>
                data.UserID.toString() === userId.toString() &&
                data.LocationID.toString() === siteId.toString() &&
                data.FacilityID.toString() === facilityId.toString()
            );
            if (scheduleData.length > 0) {
              this.getScheduleReportByUser(
                userId,
                siteId,
                facilityId,
                selectedType
              );
            } else {
              this.scheduleTime = '';
              this.emailId = this.storageService.getUserEmailId();
              this.selectedReports = [];
            }
          }
        });
    }
  }
  getScheduleReportByUser(
    userId: number,
    siteId: number,
    facilityId: number,
    selectedType: string
  ): void {
    this.schedulerService
      .getSchedule(userId, siteId, facilityId)
      .subscribe((response: any) => {
        console.log(response);
        if (Array.isArray(response.Table)) {
          const scheduleData = response.Table.filter(
            (data: any) =>
              data.UserID.toString() === userId.toString() &&
              data.LocationID.toString() === siteId.toString() &&
              data.FacilityID.toString() === facilityId.toString() &&
              data.ShedulType === selectedType
          ); // In future we need to remove tostring()

          // Check if any schedule data was found
          if (scheduleData.length > 0) {
            this.populateFormFields(scheduleData[0]);
          } else {
            this.clearFormFields();
            this.setDefaultScheduleData(selectedType);
            this.emailId = this.storageService.getUserEmailId();
          }
        }
      });
  }

  clearFormFields(): void {
    this.scheduleTime = '';
    this.selectedType = 'Select';
    this.selectedDays = [];
    this.emailId = this.storageService.getUserEmailId();
    this.facilityName = '';
    this.locationName = '';
    this.userName = '';
    this.isReport = 1;
    this.Isshedul = 1;
    this.selectedReports = [];
    this.timeZone = '';
    this.ScheduleChecked = false;

    const checkboxes = document.querySelectorAll('.ReportShedul');
    checkboxes.forEach((checkbox: Element) => {
      const input = checkbox as HTMLInputElement;
      input.checked = false; // Uncheck the checkbox
    });
  }
  setDefaultScheduleData(selectedType: string): void {
    // Set default values for a new schedule
    this.scheduleTime = '';
    this.selectedType = selectedType;
    this.selectedDays = [];
    this.emailId = '';
    this.facilityName = '';
    this.locationName = '';
    this.userName = '';
    this.isReport = 1;
    this.Isshedul = 1;
    this.selectedReports = [];
    this.timeZone = '';
    this.ScheduleChecked = false;
  }
  populateFormFields(scheduleData: any): void {
    this.scheduleTime = scheduleData.ShedulTime;
    this.selectedType = scheduleData.ShedulType;
    // Check if ShedulDay is an array or a string
    if (Array.isArray(scheduleData.ShedulDay)) {
      this.selectedDays = scheduleData.ShedulDay;
    } else if (typeof scheduleData.ShedulDay === 'string') {
      this.selectedDays = scheduleData.ShedulDay.split(',').map((day: string) =>
        day.trim()
      );
    } else {
      this.selectedDays = [];
    }
    this.emailId = scheduleData.EmailAddress;
    this.facilityName = scheduleData.FacilityName;
    this.locationName = scheduleData.LocationName;
    this.userName = scheduleData.UserName;
    this.isReport = scheduleData.IsReport;
    this.selectedReports = scheduleData.NoOfReport;
    this.timeZone = scheduleData.TimeZone;

    this.ScheduleChecked = ['Daily', 'Weekly', 'Monthly'].includes(
      this.selectedType
    );

    const checkboxes = document.querySelectorAll('.ReportShedul');
    checkboxes.forEach((checkbox: Element) => {
      const input = checkbox as HTMLInputElement;
      input.checked = this.selectedReports.includes(input.value);
    });
    // Update checkboxes for selectedDays
    const dayCheckboxes = document.querySelectorAll('.day-checkbox');
    dayCheckboxes.forEach((checkbox: Element) => {
      const input = checkbox as HTMLInputElement;
      input.checked = this.selectedDays.includes(input.value);
    });
  }
  getSelectedReports(): Promise<string[]> {
    return new Promise((resolve) => {
      let selectedReports: string[] = [];
      const checkboxes = document.querySelectorAll('.ReportShedul:checked');
      checkboxes.forEach((checkbox: Element) => {
        const input = checkbox as HTMLInputElement;
        selectedReports.push(input.value);
      });
      resolve(selectedReports);
    });
  }
}
