import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppState } from '../../../core/utils/report-types-utils';
import { IzDataTableComponent } from '../../../shared/iz-data-table/iz-data-table.component';
import { IzDropdownComponent } from '../../../shared/iz-dropdown/iz-dropdown.component';
import { IzTextboxComponent } from '../../../shared/iz-textbox/iz-textbox.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { TableUtilsService } from '../../../shared/service/table-utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { AddAsset, AssetColumns } from '../../models/admin.model';
import { IAssetType } from '../../models/dropdown.module';
import { AssetService } from '../../services/asset.service';
import { DropdownService } from '../../services/dropdown.service';
// import { DeviceDetails } from '../../models/admin.model';
import { HeaderService } from '../../../layout/header/services/header.service';

interface DeviceOption {
  value: number; // Assuming BACnetDeviceID is a number
  label: string; // The formatted label
}
@Component({
  selector: 'app-asset',
  standalone: true,
  imports: [
    IzTextboxComponent,
    IzDropdownComponent,
    IzDataTableComponent,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    MenuComponent,
    BsDatepickerModule,
  ],
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.css',
})
export class AssetComponent implements OnInit {
  selectedDeviceName: string | null = null;
  selectedObjectName: string | null = null;
  selectedDeviceID: number | null = null;
  selectedObjectID: number | null = null;
  selectedObjectType: string | null = null;

  private readonly assetService = inject(AssetService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly appState = inject(AppStateService);
  private readonly tableUtils = inject(TableUtilsService);
  private readonly router = inject(Router);
  private readonly dropdownService = inject(DropdownService);
  assetForm!: FormGroup;
  pageSize = 10;
  showSearch = true;
  tableData: any[] = [];
  tableColumns: any[] = [];
  dailyRange: Date[] = [];
  tableActions = [
    { label: '| ', icon: 'fa fa-eye', action: 'view' },
    { label: '| ', icon: 'fa fa-edit', action: 'edit' },
    { label: '', icon: 'fa fa-trash', action: 'delete' },
  ];

  isEditMode = signal(false);
  isViewMode = signal(true);
  selectedCountry: number | null = null;
  typeOptions = signal<{ value: number; label: string }[]>([]);
  mUnitOptions = signal<{ value: number; label: string }[]>([]);

  adminFacilityID = signal<number | null>(null);
  facilityName = signal<string | null>('');
  adminPLocationID = signal<number | null>(null);
  buildingName = signal<string | null>('');
  floorName = signal<string | null>('');
  assetsType = signal<string | null>('');
  assetsUnit = signal<string | null>('');
  existingAssetNames: Set<string> = new Set();
  existingAssetNumbers: Set<string> = new Set();
  deviceOptions: DeviceOption[] = [];
  objectOptions: { value: { name: string; id: number }; label: string }[] = [];
  constructor(private headerService: HeaderService) {
    this.headerService.isLogin(true);
  }
  ngOnInit() {
    this.initForm();
    const facilityId = this.appState.getParameter(AppState.AdminFacilityID);
    this.loadDevices(facilityId); // Load devices on initialization
    setTimeout(() => {
      this.adminFacilityID.set(this.appState.getParameter('adminFacilityID'));
      this.facilityName.set(this.appState.getParameter('adminFacilityName'));
      this.adminPLocationID.set(this.appState.getParameter('ParentLocationID'));
      this.buildingName.set(this.appState.getParameter('adminLocationName'));
      this.adminPLocationID.set(this.appState.getParameter('adminFloorId'));
      this.floorName.set(this.appState.getParameter('adminFloorName'));
    }, 500);
    const userId = this.appState.getParameter(AppState.UserId);
    const fid = this.appState.getParameter(AppState.AdminFacilityID);
    const lid = this.appState.getParameter('adminFloorId');
    this.loadAssetTypes(userId, fid, lid);
    this.loadAssets(fid, lid);
    //this.loadFloors(lid);

    this.assetForm.patchValue({
      facilityId: fid,
      locationId: lid,
    });
  }
  loadAssets(fid: string, lid: string) {
    if (!fid || !lid) {
      console.error(
        'Invalid parameters: facilityId and locationId are required'
      );
      return;
    }
    this.assetService.getAssets(fid, lid).subscribe((response: any) => {
      if (response?.Table?.length) {
        this.tableColumns = this.tableUtils.generateTableColumns(
          AssetColumns.allowedColumns,
          AssetColumns.sortableColumns,
          AssetColumns.hiddenColumns
        );

        this.tableData = this.tableUtils.filterTableData(
          response.Table,
          this.tableColumns
        );
        // Populate existing asset names and numbers
        this.existingAssetNames.clear();
        this.existingAssetNumbers.clear();
        response.Table.forEach((asset: any) => {
          this.existingAssetNames.add(asset.AssetName.trim());
          this.existingAssetNumbers.add(asset.AssetNumber.trim());
        });
      } else {
        this.tableData = []; // Clear the table data
      }
    });
  }

  initForm() {
    this.assetForm = this.fb.nonNullable.group({
      facilityId: [{ value: '', disabled: true }],
      locationId: [{ value: '', disabled: true }],
      assetId: [{ value: '', disabled: true }],
      assetName: ['', [Validators.required]], // Removed disabled state for required fields
      assetNumber: ['', Validators.required],
      assetType: [''],
      assetTypeId: [''],
      assetUnit: [''],
      unitId: ['', Validators.required],
      area: ['', Validators.required],
      areaUnit: ['Sq-ft', Validators.required],
      capacity: ['', Validators.required],
      capacityUnit: ['kW', Validators.required],
      utilityRate: ['0'],
      targetIntensity: ['0'],
      slope: ['0'],
      constant: ['0'],
      targetBudget: ['0'],
      deviceParameter: [null],
      bacnetPointName: [null],
      isReadFromDatabase: [false],
      rateDate: [''],
      selectedDevice: [null],
      selectedObject: [null],
      txtAssociation: [''],
    });
    // Start with form disabled
    this.assetForm.disable();
  }

  AssetAllData: any[] = [];

  loadAssetTypes(userId: number, fid: number, lid: number) {
    this.dropdownService
      .getAssetTypes(userId, fid, lid)
      .subscribe((countries: IAssetType[]) => {
        this.AssetAllData = countries;
        this.typeOptions.set(
          this.mapToDropdownOptions(
            (countries as any)?.Table2,
            'AssetTypeID',
            'AssetType'
          )
        );
      });
  }

  private mapToDropdownOptions(
    data: any[],
    valueKey: string,
    labelKey: string
  ): { value: any; label: string }[] {
    return (
      data?.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
      })) || []
    );
  }

  loadUnitType(id: any) {
    this.mUnitOptions.set([
      ...((this.AssetAllData as any)?.Table3?.filter(
        (unitType: any) => unitType.AssetTypeID == id
      ) // ✅ Apply condition
        ?.map((unitType: any) => ({
          value: unitType.UnitID,
          label: unitType.Unit,
        })) || []),
      { value: 0, label: 'Other' },
    ]);
  }
  //Swati Changes
  loadDevices(facilityID: number) {
    this.assetService.getBACnetDevices(facilityID).subscribe(
      (response: any) => {
        let parsed: any;
        try {
          parsed =
            typeof response === 'string' ? JSON.parse(response) : response;
        } catch (err) {
          console.error('Failed to parse response:', err);
          return;
        }

        const devices = Array.isArray(parsed?.Table)
          ? parsed.Table
          : Array.isArray(parsed?.data?.Table)
          ? parsed.data.Table
          : Array.isArray(parsed)
          ? parsed
          : [];

        if (!devices.length) {
          console.warn('No devices found in response:', parsed);
        }

        this.deviceOptions = devices.map((device: any) => ({
          value: device.BACnetDeviceID,
          label: `${device.BACnetDeviceName} (${device.BACnetDeviceID})`,
        }));

        console.log('Processed device options:', this.deviceOptions);
      },
      (error) => {
        console.error('Error fetching BACnet devices:', error);
        alert('Failed to load BACnet devices.');
      }
    );
  }

  onDeviceChange(event: Event) {
    const BACnetDeviceID = Number((event.target as HTMLSelectElement).value);
    const facilityID = Number(this.assetForm.get('facilityId')?.value);
    const selectedDevice = this.deviceOptions.find(
      (device) => device.value === BACnetDeviceID
    );

    // Store only the BACnetDeviceName in selectedDeviceName
    this.selectedDeviceName = selectedDevice
      ? selectedDevice.label.split(' (')[0]
      : null; // Extracting only the name part
    this.selectedDeviceID = BACnetDeviceID;

    // Load objects associated with the selected device
    this.loadObjects(BACnetDeviceID, facilityID);
  }

  loadObjects(BACnetDeviceID: number, facilityID: number) {
    this.assetService.getBACnetObjects(BACnetDeviceID, facilityID).subscribe(
      (response: any) => {
        let parsed: any;

        try {
          parsed =
            typeof response === 'string' ? JSON.parse(response) : response;
        } catch (err) {
          console.error('Failed to parse BACnet objects response:', err);
          return;
        }

        const objects = Array.isArray(parsed?.Table)
          ? parsed.Table
          : Array.isArray(parsed?.data?.Table)
          ? parsed.data.Table
          : Array.isArray(parsed)
          ? parsed
          : [];

        if (!objects.length) {
          console.warn('No BACnet objects found in response:', parsed);
          return;
        }

        this.objectOptions = objects.map((object: any) => ({
          value: object.BACnetObjectName,
          label: `${object.BACnetObjectName}:${object.BACnetObjectType} (${object.BACnetObjectID})`,
        }));
      },
      (error) => {
        console.error('Error fetching BACnet objects:', error);
        alert('Failed to load BACnet objects. Please try again.');
      }
    );
  }
  onObjectChange(event: Event) {
    const BACnetObjectName = (event.target as HTMLSelectElement).value; // Store the selected label as BACnetObjectName

    const selectedObject = this.objectOptions.find(
      (object) => object.value.toString() === BACnetObjectName.toString()
    );
    this.selectedObjectName = selectedObject ? selectedObject.label : null;

    // Store the selected object details
    if (selectedObject) {
      this.selectedObjectName = selectedObject.label; // Store the full label
      //this.selectedObjectID = Number(selectedObject.value.id);

      const [objectName, objectType, objectid] = selectedObject.label
        .split(/:\s*|\s*\(|\s*\)/)
        .map((part) => part.trim());
      this.selectedObjectName = objectName.trim();
      this.selectedObjectType = objectType ? objectType.trim() : null;
      this.selectedObjectID = Number(objectid.trim());
    } else {
      this.selectedObjectName = null;
      this.selectedObjectID = null;
      this.selectedObjectType = null;
    }

    // Construct the association text
    this.updateAssociationText();
  }

  private updateAssociationText() {
    if (
      this.selectedDeviceName &&
      this.selectedObjectName &&
      this.selectedDeviceID
    ) {
      const associationText = `${this.selectedDeviceName}:${this.selectedObjectName}:${this.selectedDeviceID},${this.selectedObjectType}(${this.selectedObjectID})`;

      // Update the form control
      this.assetForm.get('txtAssociation')?.setValue(associationText);
    }
  }

  associateWithBACnetPoint() {
    const facilityID = Number(this.assetForm.get('facilityId')?.value);
    if (facilityID) {
      this.loadDevices(facilityID);
    } else {
      alert('Please select a valid facility ID.');
    }
  }

  onmUnitChange($event: Event) {
    const selectedElement = $event.target as HTMLSelectElement;
    const selectedText =
      selectedElement.options[selectedElement.selectedIndex].text.trim();
    this.assetsUnit.set(selectedText);
  }
  onClear() {
    // this.assetForm.reset();
    if (this.isEditMode() || !this.isViewMode()) {
      if (confirm('Discard changes?')) {
        this.switchToViewModes();
        this.assetForm.reset();
      }
    }
  }
  private switchToViewModes() {
    this.isViewMode.set(true);
    this.isEditMode.set(false);
    this.assetForm.disable();
  }
  onAdd() {
    this.maintainFormState();
    this.assetForm.enable();
    this.isViewMode.set(false);
    this.enableFormForEditing();
  }

  onTypeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const selectedElement = event.target as HTMLSelectElement;
    const selectedText =
      selectedElement.options[selectedElement.selectedIndex].text.trim();
    this.assetsType.set(selectedText);
    this.selectedCountry = Number(selectedValue); // Convert to number if needed
    if (this.selectedCountry) {
      this.loadUnitType(this.selectedCountry);
    } else {
      this.mUnitOptions.set([]);
    }
    //console.log('Selected Country ID:', this.selectedCountry);
  }
  private maintainFormState(resetForm: boolean = true) {
    // Always preserve these values from either current form or appState
    const facilityId =
      this.assetForm.get('facilityId')?.value ||
      this.appState.getParameter(AppState.AdminFacilityID);
    const locationId =
      this.assetForm.get('locationId')?.value ||
      this.appState.getParameter('adminFloorId');

    if (resetForm) {
      this.assetForm.reset();
    }

    // Restore the critical IDs
    this.assetForm.patchValue({
      facilityId: facilityId,
      locationId: locationId,
    });
  }
  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.editFields(event.row);
      this.assetForm.enable();
      this.isViewMode.set(false);
    } else if (event.action === 'delete') {
      this.DeleteFacilityById(event.row.AssetID, event.row.FacilityID);
    } else if (event.action === 'view') {
      // this.initForm();
      // this.isViewMode.set(true);
      // this.editFields(event.row);
      this.switchToViewMode(event.row);
    }
  }
  private DeleteFacilityById(AssetID: number, FacilityID: any) {
    if (confirm('Are you sure you want to delete this Asset')) {
      this.assetService.DeleteAssetById(AssetID).subscribe({
        next: () => {
          // Success case
          const lid = this.appState.getParameter('adminFloorId');

          alert('Asset deleted successfully!');
          this.loadAssets(FacilityID, lid); // Refresh the table data
          this.maintainFormState();
          this.switchToViewModes(); // Add this line to reset the form
        },
        error: (err: any) => {
          // Error case
          console.error('Error deleting Asset:', err);
          alert('Failed to delete Asset. Please try again.');
        },
      });
    }
  }
  private switchToViewMode(row: any) {
    this.isViewMode.set(true);
    this.isEditMode.set(false);

    // Disable the form but keep values
    this.assetForm.disable();

    // Patch values if viewing a specific row
    if (row) {
      this.editFields(row);
      this.assetForm.disable();
    }
  }
  editFields(row: any) {
    if (row.AssetID !== 0) {
      const bd = row; // Access the first element
      // this.typeOptions.set([]);
      const assetData = (this.AssetAllData as any)?.Table2 ?? [];
      const assetUnitData = (this.AssetAllData as any)?.Table3 ?? [];
      const assetTypeId =
        assetData.find((unitType: any) => unitType.AssetType === bd.AssetsType)
          ?.AssetTypeID ?? null;
      this.loadUnitType(assetTypeId);
      const assetUnitId =
        assetUnitData.find(
          (unitType: any) =>
            unitType.AssetTypeID === assetTypeId &&
            unitType.Unit === bd.AssetsUnit
        )?.UnitID ?? null;

      setTimeout(() => {
        this.isEditMode.set(true);
        this.maintainFormState(false);
        this.assetForm.patchValue({
          parentLocationId: bd.ParentLocationID,
          facilityId: bd.FacilityID,
          locationId: bd.LocationID,
          locationName: bd.LocationName,
          assetId: bd.AssetID,
          assetName: bd.AssetName,
          assetNumber: bd.AssetNumber,
          facilityName: bd.FacilityName,
          floorName: bd.FloorName,
          locationType: bd.LocationType,
          buildingID: bd.BuildingID,
          buildingName: bd.BuildingName,
          assetTypeId: assetTypeId,
          unitId: assetUnitId,
          capacity: bd.Capacity,
          capacityUnit: bd.CapacityUnit,
          area: bd.Area,
          areaUnit: bd.AreaUnit,
          monthlyIntensity: bd.TargetIntensity,
          slope: bd.Slope,
          constant: bd.Constant,
          targetBudget: bd.TargetBudget,
          deviceParameter: bd.DeviceParameter,
          currentRuntime: bd.CurrentRuntime,
          receivedDate: bd.ReceivedDate,
          utilityRated: bd.UtilityRate,
          rateDate: this.formatDate(bd.RateDate),
          txtAssociation: [''],
        });
        if (!this.assetsType()) {
          this.assetsType.set(bd.AssetsType || 'DefaultAssetType');
        }
        if (!this.assetsUnit()) {
          this.assetsUnit.set(bd.AssetsUnit || 'DefaultUnit');
        }
        this.enableFormForEditing();
        // this.isEditMode.set(true);
      }, 500);
    } else {
      console.error('Table is empty or not an array:');
    }
  }
  private enableFormForEditing() {
    // Enable the entire form
    this.assetForm.enable();

    // Keep these fields always disabled
    // this.assetForm.get('facilityId')?.disable();
    // this.assetForm.get('locationId')?.disable();
  }
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // MM/DD/YYYY format
  }
  private hasDuplicateAsset(): boolean {
    const isEditMode = Number(this.assetForm.get('assetId')?.value) !== 0;
    const assetName = this.normalizeString(
      this.assetForm.get('assetName')?.value
    );
    const assetNumber = this.normalizeString(
      this.assetForm.get('assetNumber')?.value
    );

    if (isEditMode) {
      return false;
    }
    if (this.existingAssetNames.has(assetName)) {
      alert('Asset name already exists. Please enter a unique asset name.');
      return true;
    }

    if (this.existingAssetNumbers.has(assetNumber)) {
      alert('Asset number already exists. Please enter a unique asset number.');
      return true;
    }

    return false;
  }

  private normalizeString(value: string): string {
    if (!value) return '';
    return value.trim().replace(/\s+/g, ' ');
  }

  onSubmit(): void {
    this.maintainFormState(false);
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched(this.assetForm);

    // Check form validity
    if (this.assetForm.invalid) {
      console.log('Form is invalid. Please fill all required fields.');

      // Optionally scroll to first invalid field
      this.scrollToFirstInvalidControl();
      return;
    }
    //Swati Changes
    // Check for duplicate asset name or number
    if (this.hasDuplicateAsset()) {
      return;
    }
    // Patch the deviceParameter and bacnetPointName values
    this.assetForm.patchValue({
      deviceParameter: `${this.selectedDeviceID}, ${this.selectedObjectType}:${this.selectedObjectID}`,
      bacnetPointName: `${this.selectedObjectName}:${this.selectedObjectType}(${this.selectedObjectID})`, // Store formatted string
    });

    const assetData = new AddAsset({
      ...this.assetForm.value,
      facilityId: Number(this.assetForm.value.facilityId),
      locationId: Number(this.assetForm.value.locationId),
      fromDate: this.assetForm.value.rateDate,
      assetType: this.assetsType(),
      assetUnit: this.assetsUnit(),
    });

    this.AddAsset(assetData);
  }

  // Helper method to mark all fields as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to scroll to first invalid field
  private scrollToFirstInvalidControl() {
    const firstInvalidControl = document.querySelector('ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  private AddAsset(formData: AddAsset): void {
    if (Number(formData.assetId) !== 0) {
      this.assetService.updateAsset(formData).subscribe(() => {
        alert('Asset Update successfully!');
        this.assetForm.reset();
        this.loadAssets(
          formData.facilityId?.toString() ?? '',
          formData.locationId?.toString() ?? ''
        );
        this.isEditMode.set(false);
        // this.router.navigate(['/facilities']);
      });
    } else {
      this.assetService.addAsset(formData).subscribe(() => {
        alert('Asset added successfully!');
        this.assetForm.reset();
        this.loadAssets(
          formData.facilityId?.toString() ?? '',
          formData.locationId?.toString() ?? ''
        );
        this.isEditMode.set(false);
        // this.router.navigate(['/facilities']);
      });
    }
  }
}
