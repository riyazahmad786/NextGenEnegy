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
import { IzTextboxComponent } from '../../../shared/iz-textbox/iz-textbox.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { TableUtilsService } from '../../../shared/service/table-utils.service';
import { MenuComponent } from '../../menu/menu.component';
import { AddFloor } from '../../models/admin.model';
import { FloorService } from '../../services/floor.service';
import { HeaderService } from '../../../layout/header/services/header.service';

@Component({
  selector: 'app-floor',
  standalone: true,
  imports: [
    IzTextboxComponent,
    IzDataTableComponent,
    ReactiveFormsModule,
    CollapsiblePanelComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    MenuComponent,
  ],
  templateUrl: './floor.component.html',
  styleUrl: './floor.component.css',
})
export class FloorComponent implements OnInit {
  private readonly floorService = inject(FloorService);
  private readonly fb = inject(FormBuilder);
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
    { label: ' ', icon: 'fa fa-building-o', action: 'asset' },
  ];
  pageSize = 4;
  showSearch = true;
  floorid?: number;
  isEditMode = signal(false);
  selectedCountry: number | null = null;
  countryOptions = signal<{ value: number; label: string }[]>([]);
  stateOptions = signal<{ value: number; label: string }[]>([]);
  adminFacilityID = signal<number | null>(null);
  facilityName = signal<string | null>('');
  adminPLocationID = signal<number | null>(null);
  buildingName = signal<string | null>('');
constructor(
    private headerService: HeaderService
  ) {this.headerService.isLogin(true);}
  ngOnInit() {
    setTimeout(() => {
      this.adminFacilityID.set(this.appState.getParameter('adminFacilityID'));
      this.facilityName.set(this.appState.getParameter('adminFacilityName'));
      this.adminPLocationID.set(this.appState.getParameter('ParentLocationID'));
      this.buildingName.set(this.appState.getParameter('adminLocationName'));
    }, 500);
    const fid = this.appState.getParameter('adminFacilityID');
    const Floorid = this.appState.getParameter('Flocation');
    const lid = this.appState.getParameter('adminLocationID');
    const bid = this.appState.getParameter('BuildingId');
    const LPid = this.appState.getParameter('ParentLocationID');

    this.loadFloors(lid);
    this.onClear();

    this.floorForm.patchValue({
      facilityId: fid,
      parentLocationId: lid,
      locationId: '',
      bLocationId: bid,
    });
  }
  loadFloors(fid: any) {
    this.floorService.getFloors(fid).subscribe((response: any) => {
      if (response?.Table?.length) {
        const allowedColumns = [
          'LocationID',
          'ParentLocationID',
          'LocationName',
        ];

        this.tableColumns = this.tableUtils.generateTableColumns(
          allowedColumns,
          ['LocationName'], // Sortable columns
          ['LocationID', 'ParentLocationID'] // Hidden columns
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

  floorForm = this.fb.nonNullable.group({
    facilityId: [''],
    locationId: [''],
    bLocationId: [''],
    locationName: ['', Validators.required],
    parentLocationId: [''],
  });

  onSubmit() {
    if (this.floorForm.invalid) return;
    const floorName = this.floorForm.value.locationName;

    // Check for duplicate floor name
    if (!this.isEditMode() && this.isDuplicateFloorName(floorName!)) {
      alert(
        'A floor with this name already exists. Please choose a different name.'
      );
      return;
    }

    const floorData = new AddFloor({
      ...this.floorForm.value,
      facilityId: Number(this.floorForm.value.facilityId),
      locationId: Number(this.floorForm.value.locationId),
      bLocationId: Number(this.floorForm.value.bLocationId),
      parentLocationId: Number(this.floorForm.value.parentLocationId),
    });
    this.AddFloor(floorData);
  }
  //Method for duplicate Floor Name
  private isDuplicateFloorName(floorName: string): boolean {
    const FloorName = floorName.trim().replace(/\s+/g, ' ').toLowerCase();
    return this.tableData.some(
      (floor) =>
        floor.LocationName.trim().replace(/\s+/g, ' ').toLowerCase() ===
        FloorName
    );
  }
  private AddFloor(formData: AddFloor): void {
    this.appState.addParameter(
      'adminFloorName',
      this.floorForm.value.locationName
    );
    if (formData.locationId !== 0) {
      this.floorService.updateFloor(formData).subscribe((LocationId: any) => {
        alert('floor Update successfully!');
        this.floorForm.reset();
        this.loadFloors(formData.parentLocationId?.toString() ?? '');
        this.isEditMode.set(false);
        // this.router.navigate(['/facilities']);
      });
    } else {
      this.floorService.addFloor(formData).subscribe((LocationId: any) => {
        this.appState.addParameter(
          AppState.AdminFloorId.toString(),
          LocationId
        );
        alert('floor added successfully!');
        // this.floorForm.reset();
        this.loadFloors(formData.parentLocationId?.toString() ?? '');
        this.isEditMode.set(false);
        this.router.navigate(['/asset']);
      });
    }
  }

  onClear() {
    this.floorForm.reset();
  }
  handleAction(event: { action: string; row: any }) {
    if (event.action === 'edit') {
      this.loadFloorById(event.row.LocationID);
      this.isPanelCollapsed.set(false);
    } else if (event.action === 'delete') {
      this.DeletefloorById(event.row.LocationID, event.row.ParentLocationID);
      //this.loadFloorById(event.row.LocationID);
    } else if (event.action === 'asset') {
      this.appState.addParameter('adminFloorId', event.row.LocationID);
      this.appState.addParameter('adminFloorName', event.row.LocationName);
      this.router.navigate(['/asset']);
    }
  }
  private DeletefloorById(id: number, Pid: number) {
    if (confirm('Are you sure you want to delete this Floor?')) {
      this.floorService.DeletefloorById(id, Pid).subscribe({
        next: () => {
          // Success case
          alert('Floor deleted successfully!');
          // const facilityId = this.appState.getParameter(
          //   AppState.AdminFacilityID.toString()
          // );
          this.loadFloors(Pid);

          // this.loadBuildings(); // Refresh the table data
        },
        error: (err: any) => {
          // Error case
          console.error('Error deleting Floor:', err);
          alert('Failed to delete Floor. Please try again.');
        },
      });
    }
  }

  private loadFloorById(id: number) {
    this.appState.addParameter('Flocation', id);
    this.floorService.getFloorById(id).subscribe((floor: any) => {
      floor = (floor as any)?.Table; // Extract the Table property
      if (Array.isArray(floor) && floor.length > 0) {
        const bd = floor[0]; // Access the first element
        this.stateOptions.set([]);
        const plocationId = this.appState.getParameter('Flocation');
        setTimeout(() => {
          this.isEditMode.set(true);
          this.floorForm.patchValue({
            //parentLocationId: plocationId,
            parentLocationId: bd.LocationID,
            facilityId: bd.FacilityID,
            //locationId: bd.LocationID,
            locationId: plocationId,
            locationName: bd.LocationName,
          });
        }, 500);
      } else {
        console.error('Table is empty or not an array:', floor);
      }
    });
  }
}
