import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppState } from '../../../core/utils/report-types-utils';
import { CollapsiblePanelComponent } from '../../../shared/collapsible-panel/collapsible-panel.component';
import { IzDataTableComponent } from '../../../shared/iz-data-table/iz-data-table.component';
import { IzDropdownComponent } from '../../../shared/iz-dropdown/iz-dropdown.component';
import { IzTextboxComponent } from '../../../shared/iz-textbox/iz-textbox.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { TableUtilsService } from '../../../shared/service/table-utils.service';
import { AddFacility } from '../../models/admin.model';
import { ICountry } from '../../models/dropdown.module';
import { DropdownService } from '../../services/dropdown.service';
import { FacilityService } from '../../services/facility.service';

@Component({
  selector: 'app-facility',
  standalone: true,

  imports: [
    IzTextboxComponent,
    IzDropdownComponent,
    IzDataTableComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    CollapsiblePanelComponent,
    FormsModule,
  ],
  templateUrl: './facility.component.html',
  styleUrl: './facility.component.css',
})
export class FacilityComponent implements OnInit {
  isPanelCollapsed = signal(true);
  userName: any;
  //facilityForm!: FormGroup;
  selectedCountry: number | null = null;
  countryOptions = signal<{ value: number; label: string }[]>([]);
  stateOptions = signal<{ value: number; label: string }[]>([]);
  timeZoneOptions = signal<{ value: string; label: string }[]>([]);
  isEditMode = signal(false);
  facilityId: number | null = null;

  constructor(private appState: AppStateService) {
    this.appState.removeParameter(AppState.AdminFacilityID.toString());
    this.appState.removeParameter(AppState.AdminFacilityName.toString());
  }

  tableColumns: any[] = [];
  tableData: any[] = [];
  tableActions = [
    { label: '| ', icon: 'fa fa-edit', action: 'edit' },
    { label: '| ', icon: 'fa fa-trash', action: 'delete' },
    { label: ' ', icon: 'fa fa-building', action: 'building' },
  ];
  pageSize = 4;
  showSearch = true;

  private readonly fb = inject(FormBuilder);
  private readonly facilityService = inject(FacilityService);
  private readonly tableUtils = inject(TableUtilsService);
  private readonly dropdownService = inject(DropdownService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  facilityForm = this.fb.nonNullable.group({
    facilityId: [''],
    facilityName: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
    ],
    emailAddress: ['', [Validators.required, Validators.email]],
    timeZone: ['', Validators.required],
  });

  ngOnInit() {
    this.loadCountries();
    this.loadTimeZones();
    this.loadFacilities();
    setTimeout(() => {
      this.appState.removeParameter(AppState.AdminFacilityID);
      this.appState.removeParameter(AppState.AdminFacilityName);
    }, 500);
  }

  loadCountries() {
    this.dropdownService.getCountries().subscribe((countries: ICountry[]) => {
      this.countryOptions.set(
        (countries as any)?.Table?.map((country: any) => ({
          value: country.CountryID,
          label: country.CountryName,
        })) || []
      );
    });
  }

  loadStates(id: any) {
    this.dropdownService.getStates(id).subscribe((states: any[]) => {
      this.stateOptions.set(
        (states as any)?.Table?.map((state: any) => ({
          value: state.StateID,
          label: state.StateName,
        })) || []
      );
    });
  }

  onCountryChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCountry = Number(selectedValue); // Convert to number if needed
    if (this.selectedCountry) {
      this.loadStates(this.selectedCountry);
    }
    console.log('Selected Country ID:', this.selectedCountry);
  }

  loadTimeZones() {
    this.dropdownService.getTimeZone().subscribe((response: any) => {
      console.log('API Response:', response); // Debugging log

      if (response && Array.isArray(response.TimeZones)) {
        this.timeZoneOptions.set(
          response.TimeZones.map((timeZone: any) => ({
            value: timeZone.Id,
            label: timeZone.DisplayName,
          }))
        );
      } else {
        console.error('Invalid data structure:', response);
        this.timeZoneOptions.set([]);
      }
    });
  }

  onSubmit(): void {
    if (this.facilityForm.invalid) return;

    const facilityData = new AddFacility({
      ...this.facilityForm.value,
      facilityId: Number(this.facilityForm.value.facilityId),
      countryID: Number(this.facilityForm.value.country), // Ensure number
      stateID: Number(this.facilityForm.value.state), // Ensure number
    });
    this.addFacility(facilityData);
  }

  private addFacility(formData: AddFacility): void {
    if (formData.facilityId !== 0) {
      this.facilityService.updateFacility(formData).subscribe(() => {
        alert('Facility Update successfully!');
        this.facilityForm.reset();
        this.loadFacilities();
        this.isEditMode.set(false);
        // this.router.navigate(['/facilities']);
      });
    } else {
      this.facilityService
        .addFacility(formData)
        .subscribe((facilityId: any) => {
          this.appState.addParameter(
            AppState.AdminFacilityID.toString(),
            facilityId
          );
          this.appState.addParameter(
            AppState.AdminFacilityName.toString(),
            formData.facilityName
          );

          console.log('Stored Facility ID:', facilityId); // Debug log
          alert('Facility added successfully!');
          this.router.navigate(['/buildings']);
          // this.facilityForm.reset();
          // this.loadFacilities();
          // this.isEditMode.set(false);
          // this.router.navigate(['/facilities']);
        });
    }
  }

  loadFacilities() {
    this.facilityService.getFacilities().subscribe((response: any) => {
      if (response?.Table?.length) {
        const allowedColumns = [
          'FacilityID',
          'FacilityName',
          'Address1',
          'City',
          'PostalCode',
          'TimeZone',
        ];

        this.tableColumns = this.tableUtils.generateTableColumns(
          allowedColumns,
          ['FacilityName', 'City'], // Sortable columns
          ['FacilityID'] // Hidden columns
        );

        this.tableData = this.tableUtils.filterTableData(
          response.Table,
          this.tableColumns
        );
      }
    });
  }

  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Convert camelCase to words
      .replace(/_/g, ' ') // Convert snake_case to words
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.loadFacilityById(event.row.FacilityID);
      this.isPanelCollapsed.set(false); // Expand the panel when editing
    } else if (event.action === 'delete') {
      this.DeleteFacilityById(event.row.FacilityID);
    } else if (event.action === 'building') {
      this.appState.addParameter('adminFacilityID', event.row.FacilityID);
      this.appState.addParameter('adminFacilityName', event.row.FacilityName);
      this.router.navigate(['/buildings']);
    }
  }
  private DeleteFacilityById(id: number) {
    if (confirm('Are you sure you want to delete this facility?')) {
      this.facilityService.DeleteFacilityById(id).subscribe({
        next: () => {
          // Success case
          alert('Facility deleted successfully!');
          this.loadFacilities(); // Refresh the table data
        },
        error: (err) => {
          // Error case
          console.error('Error deleting facility:', err);
          alert('Failed to delete facility. Please try again.');
        },
      });
    }
  }
  private loadFacilityById(id: number) {
    this.facilityService.getFacilityById(id).subscribe((facility: any) => {
      facility = (facility as any)?.Table; // Extract the Table property
      if (Array.isArray(facility) && facility.length > 0) {
        const facilityData = facility[0]; // Access the first element
        this.stateOptions.set([]);
        this.loadStates(facilityData.CountryID);
        setTimeout(() => {
          this.isEditMode.set(true);
          this.facilityForm.patchValue({
            facilityId: facilityData.FacilityID,
            facilityName: facilityData.FacilityName,
            address1: facilityData.Address1,
            address2: facilityData.Address2,
            country: facilityData.CountryID,
            state: facilityData.StateID,
            city: facilityData.City,
            postalCode: facilityData.PostalCode,
            phoneNumber: facilityData.PhoneNumber,
            emailAddress: facilityData.EmailAddress,
            timeZone: facilityData.TimeZone,
          });
        }, 500);
      } else {
        console.error('Table is empty or not an array:', facility);
      }
    });
  }

  onClear() {
    this.isEditMode.set(false);
    Object.keys(this.facilityForm.controls).forEach((key) => {
      const control =
        this.facilityForm.controls[
          key as keyof typeof this.facilityForm.controls
        ];
      control.setValue('');
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
    });
  }
}
