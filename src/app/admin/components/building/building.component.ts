import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IzDataTableComponent } from '../../../shared/iz-data-table/iz-data-table.component';
import { IzDropdownComponent } from '../../../shared/iz-dropdown/iz-dropdown.component';
import { IzTextboxComponent } from '../../../shared/iz-textbox/iz-textbox.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { TableUtilsService } from '../../../shared/service/table-utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { AddBuildings } from '../../models/admin.model';
import { ICountry } from '../../models/dropdown.module';
import { BuildingService } from '../../services/building.service';
import { DropdownService } from '../../services/dropdown.service';
// Add this import at the top of building.component.ts
import { AppState } from '../../../core/utils/report-types-utils';
import { CollapsiblePanelComponent } from '../../../shared/collapsible-panel/collapsible-panel.component';
import { HeaderService } from '../../../layout/header/services/header.service';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [
    IzTextboxComponent,
    IzDropdownComponent,
    CollapsiblePanelComponent,
    IzDataTableComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    MenuComponent,
  ],
  templateUrl: './building.component.html',
  styleUrl: './building.component.css',
})
export class BuildingComponent implements OnInit {
  private readonly buildingService = inject(BuildingService);
  private readonly fb = inject(FormBuilder);
  private readonly dropdownService = inject(DropdownService);
  private readonly route = inject(ActivatedRoute);
  private readonly appState = inject(AppStateService);
  private readonly tableUtils = inject(TableUtilsService);
  private readonly router = inject(Router);
  isPanelCollapsed = signal(true);
  tableColumns: any[] = [];
  tableData: any[] = [];
  tableActions = [
    { label: '| ', icon: 'fa fa-edit', action: 'edit' },
    { label: '| ', icon: 'fa fa-trash', action: 'delete' },
    { label: ' ', icon: 'fa fa-building-o', action: 'building' },
  ];
  pageSize = 4;
  showSearch = true;

  isEditMode = signal(false);
  selectedCountry: number | null = null;
  countryOptions = signal<{ value: number; label: string }[]>([]);
  stateOptions = signal<{ value: number; label: string }[]>([]);
  adminFacilityID = signal<number | null>(null);
  facilityName = signal<string | null>('');
constructor(
    private headerService: HeaderService
  ) {this.headerService.isLogin(true);}
  ngOnInit() {
    const facilityId = this.appState.getParameter(
      AppState.AdminFacilityID.toString()
    );
    const facilityName = this.appState.getParameter(
      AppState.AdminFacilityName.toString()
    );

    console.log('Retrieved Facility ID:', facilityId); // Debug log
    console.log('Retrieved Facility Name:', facilityName);
    //const fidd = this.appState.getParameter('adminFacilityID');
    setTimeout(() => {
      this.adminFacilityID.set(this.appState.getParameter('adminFacilityID'));
      this.facilityName.set(this.appState.getParameter('adminFacilityName'));
    }, 500);
    const fid = this.appState.getParameter('adminFacilityID');
    this.loadCountries();
    this.loadBuildings(fid);

    this.buildingForm.patchValue({
      facilityId: fid,
    });
  }

  buildingForm = this.fb.nonNullable.group({
    facilityId: [''],
    locationId: [''],
    locationName: ['', Validators.required],
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
    parentLocationId: [''],
  });

  onCountryChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCountry = Number(selectedValue); // Convert to number if needed
    if (this.selectedCountry) {
      this.loadStates(this.selectedCountry);
    }
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

  onClear() {
    throw new Error('Method not implemented.');
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

  loadBuildings(fid: string) {
    this.buildingService.getBuildings(fid).subscribe((response: any) => {
      if (response?.Table?.length) {
        const allowedColumns = [
          'FacilityID',
          'LocationID',
          'ParentLocationID',
          'LocationName',
          'Address1',
          'City',
          'PostalCode',
          'EmailAddress',
        ];

        this.tableColumns = this.tableUtils.generateTableColumns(
          allowedColumns,
          ['LocationName', 'City', 'PostalCode'], // Sortable columns
          ['FacilityID', 'LocationID', 'ParentLocationID'] // Hidden columns
        );

        this.tableData = this.tableUtils.filterTableData(
          response.Table,
          this.tableColumns
        );
      } else {
        this.tableData = []; // Clear the table data
      }
    });
  }

  private isDuplicateLocationName(
    locationName: string,
    locationId: number | null
  ): boolean {
    if (!locationName) return false;
    const normalizedLocationName = this.normalizeString(locationName); // Normalize the input location name
    return this.tableData.some(
      (item) =>
        item.LocationName?.trim().toLowerCase() ===
          normalizedLocationName.toLowerCase() && item.LocationID !== locationId
    );
  }

  private normalizeString(value: string): string {
    if (!value) return '';
    return value.trim().replace(/\s+/g, ' ');
  }
  onSubmit(): void {
    this.isEditMode.set(true);
    if (this.buildingForm.invalid) return;

    const facilityData = new AddBuildings({
      ...this.buildingForm.value,
      facilityId: Number(this.buildingForm.value.facilityId),
      locationId: Number(this.buildingForm.value.locationId),
      countryID: Number(this.buildingForm.value.country), // Ensure number
      stateID: Number(this.buildingForm.value.state), // Ensure number
      parentLocationId: Number(this.buildingForm.value.parentLocationId),
    });
    //Swati Changes
    if (
      this.isDuplicateLocationName(
        facilityData.locationName,
        facilityData.locationId ?? null
      )
    ) {
      alert('Location name already exists. Please choose a different name.');
      this.isEditMode.set(false);
      return; // Do not proceed
    }
    this.addBuilding(facilityData);
  }

  private addBuilding(formData: AddBuildings): void {
    this.appState.addParameter(
      'adminLocationName',
      this.buildingForm.value.locationName
    );
    if (formData.locationId !== 0) {
      this.buildingService.updateBuilding(formData).subscribe(() => {
        alert('building Update successfully!');
        this.buildingForm.reset();
        this.loadBuildings(formData.facilityId?.toString() ?? '');
        this.isEditMode.set(false);
        // this.router.navigate(['/facilities']);
      });
    } else {
      this.buildingService
        .addBuilding(formData)
        .subscribe((BuildingId: any) => {
          this.appState.addParameter(
            AppState.AdminLocationID.toString(),
            BuildingId
          );

          alert('building added successfully!');
          this.router.navigate(['/floor']);
          // this.buildingForm.reset();
          // this.loadBuildings(formData.facilityId?.toString() ?? '');
          // this.isEditMode.set(false);
          // this.router.navigate(['/facilities']);
        });
    }
  }

  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.loadBuildingById(event.row.LocationID);
      this.isPanelCollapsed.set(false);
    } else if (event.action === 'delete') {
      this.DeleteBuildingById(event.row.LocationID, event.row.ParentLocationID);
    } else if (event.action === 'building') {
      this.appState.addParameter('adminLocationID', event.row.LocationID);
      this.appState.addParameter('adminLocationName', event.row.LocationName);
      this.appState.addParameter(
        'ParentLocationID',
        event.row.ParentLocationID
      );
      this.router.navigate(['/floor']);
    }
  }
  private DeleteBuildingById(id: number, Pid: number) {
    if (confirm('Are you sure you want to delete this Building?')) {
      this.buildingService.DeleteBuildingById(id, Pid).subscribe({
        next: () => {
          // Success case
          alert('Building deleted successfully!');
          const facilityId = this.appState.getParameter(
            AppState.AdminFacilityID.toString()
          );
          this.loadBuildings(facilityId);
          // this.loadBuildings(); // Refresh the table data
        },
        error: (err: any) => {
          // Error case
          console.error('Error deleting Building:', err);
          alert('Failed to delete Building. Please try again.');
        },
      });
    }
  }

  private loadBuildingById(id: number) {
    this.buildingService.getBuildingById(id).subscribe((building: any) => {
      building = (building as any)?.Table; // Extract the Table property
      if (Array.isArray(building) && building.length > 0) {
        const bd = building[0]; // Access the first element
        this.stateOptions.set([]);
        this.loadStates(bd.CountryID);
        setTimeout(() => {
          this.isEditMode.set(true);
          this.buildingForm.patchValue({
            parentLocationId: bd.ParentLocationID,
            facilityId: bd.FacilityID,
            locationId: bd.LocationID,
            locationName: bd.LocationName,
            address1: bd.Address1,
            address2: bd.Address2,
            country: bd.CountryID,
            state: bd.StateID,
            city: bd.City,
            postalCode: bd.PostalCode,
            phoneNumber: bd.PhoneNumber,
            emailAddress: bd.EmailAddress,
          });
        }, 500);
      } else {
        console.error('Table is empty or not an array:', building);
      }
    });
  }
}
