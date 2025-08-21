import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import { AppState } from '../../../core/utils/report-types-utils';
import { HeaderService } from '../../../layout/header/services/header.service';
import { IzDropdownComponent } from '../../../shared/iz-dropdown/iz-dropdown.component';
import { AppStateService } from '../../../shared/service/app-state.service';
import { MenuComponent } from '../../menu/menu.component';
import { ExcelDeviceRow } from '../../models/admin.model';
import { DropdownService } from '../../services/dropdown.service';
import { ReadingSourceService } from '../../services/reading-source.service';

interface ExcelRow {
  MeterID: string;
  Reading: number;
  Date: string;
  Type: string;
}

@Component({
  selector: 'app-reading-source',
  standalone: true,
  imports: [
    MenuComponent,
    RouterModule,
    CommonModule,
    IzDropdownComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './reading-source.component.html',
  styleUrl: './reading-source.component.css',
})
export class ReadingSourceComponent implements OnInit {
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);

  private readonly readingSource = inject(ReadingSourceService);
  private readonly appState = inject(AppStateService);

  private readonly dropdownService = inject(DropdownService);
  facilityOptions = signal<{ value: number; label: string }[]>([]);
  buildingOptions = signal<{ value: number; label: string }[]>([]);
  floorOptions = signal<{ value: number; label: string }[]>([]);
  meterOptions = signal<{ value: number; label: string }[]>([]);
  actionName = signal('');
  excelData: ExcelRow[] = [];
  excelDeviceRow: ExcelDeviceRow[] = [];
  // successMessage: string = '';
  // errorMessage = signal<string>('');
  // Add these at the top of your component class
  successMessage = signal<string>(''); // Changed to signal
  errorMessage = signal<string>(''); // Already exists in your code
  // isProcessing = signal<boolean>(false); // Add loading state

  worksheetData: XLSX.WorkSheet | null = null; // Step 1: Store worksheet here
  constructor(private headerService: HeaderService) {
    this.headerService.isLogin(true);
  }
  ngOnInit() {
    this.onLoadFacility();
    this.actionName.set('Electric');
    this.errorMessage.set('');
  }

  utilityButtons = [
    { label: 'Electric Bill', value: 'Electric' },
    { label: 'Gas Bill', value: 'Gas' },
    { label: 'Water Bill', value: 'Water' },
  ];

  activeButton: string = this.utilityButtons[0].value;

  // Function to handle button click
  setActiveButton(value: string) {
    this.activeButton = value;
    this.actionName.set(this.activeButton);
    this.clearForm();
  }

  clearForm(): void {
    this.billForm.reset();
  }

  radioOptions = [
    { value: 'directfromdevice', label: 'Direct from Device' },
    { value: 'ReadingSource', label: 'Utility Bill Import' },
    { value: 'EnergyStar', label: 'Energy Star' },
  ];

  selectedOption = signal<string>('ReadingSource'); // Default selection

  onSelectionChange(value: string): void {
    this.selectedOption.set(value);
  }

  getSelectedLabel(): string {
    return (
      this.radioOptions.find((opt) => opt.value === this.selectedOption())
        ?.label || ''
    );
  }

  onLoadFacility() {
    this.dropdownService.getFacilities().subscribe((countries: any[]) => {
      this.facilityOptions.set(
        (countries as any)?.Table?.map((country: any) => ({
          value: country.FacilityID,
          label: country.FacilityName,
        })) || []
      );
    });
  }

  selectedFid: number | null = null;
  FacilityName: string = '';
  onFacilityChange($event: Event) {
    this.buildingOptions.set([]);
    this.selectedBid = null;
    this.floorOptions.set([]);
    this.selectedFloorId = null;
    this.meterOptions.set([]);
    this.selectedMid = null;
    const selectElem = $event.target as HTMLSelectElement;
    const selectedValue = ($event.target as HTMLSelectElement).value;
    this.selectedFid = Number(selectedValue); // Convert to number if needed
    this.FacilityName =
      selectElem.options[selectElem.selectedIndex].text.trim();
    this.appState.addParameter(
      AppState.FacilityName.toString(),
      this.FacilityName
    );
    // const  FacilityName = this.appState.addParameter(
    //       AppState.FacilityName);
    if (this.selectedFid) {
      this.onLoadBuilding(this.selectedFid);
    }
  }

  onLoadBuilding(fid: number) {
    this.dropdownService.getBuildings(fid).subscribe((countries: any[]) => {
      this.buildingOptions.set(
        (countries as any)?.Table?.map((country: any) => ({
          value: country.LocationID,
          label: country.LocationName,
        })) || []
      );
    });
  }

  selectedBid: number | null = null;
  onBuildingChange($event: Event) {
    this.floorOptions.set([]);
    this.selectedFloorId = null;
    this.meterOptions.set([]);
    this.selectedMid = null;
    const selectedValue = ($event.target as HTMLSelectElement).value;
    this.selectedBid = Number(selectedValue); // Convert to number if needed
    if (this.selectedBid) {
      this.onLoadFloor(this.selectedBid);
    }
  }

  onLoadFloor(bid: number) {
    this.dropdownService.getFloors(bid).subscribe((countries: any[]) => {
      this.floorOptions.set(
        (countries as any)?.Table?.map((country: any) => ({
          value: country.LocationID,
          label: country.LocationName,
        })) || []
      );
    });
  }

  selectedFloorId: number | null = null;
  onFloorChange($event: Event) {
    this.meterOptions.set([]);
    this.selectedMid = null;
    const selectedValue = ($event.target as HTMLSelectElement).value;
    this.selectedFloorId = Number(selectedValue); // Convert to number if needed
    if (this.selectedFloorId) {
      this.onLoadMeter(
        this.selectedFid,
        this.selectedFloorId,
        this.activeButton
      );
    }
  }

  onLoadMeter(facilityID: any, locationID: any, type: any) {
    this.dropdownService
      .getMeter(facilityID, locationID, type)
      .subscribe((countries: any[]) => {
        this.meterOptions.set(
          (countries as any)?.Table?.map((country: any) => ({
            value: country.AssetID,
            label: country.AssetName,
          })) || []
        );
      });
  }

  selectedMid: number | null = null;
  selectedText: string = '';

  onMeterChange($event: Event) {
    const selectedValue = $event.target as HTMLSelectElement;
    this.selectedText =
      selectedValue.options[selectedValue.selectedIndex].text.trim();
    this.selectedMid = Number(selectedValue.value); // Convert to number if needed
  }

  billForm = this.fb.group({
    facility: ['', Validators.required],
    building: ['', Validators.required],
    floor: ['', Validators.required],
    meter: ['', Validators.required],
    file: ['', Validators.required],
  });

  async onSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    //this.isProcessing.set(true);
    if (!this.worksheetData) {
      this.errorMessage.set('Please upload a file first.');
      //this.isProcessing.set(false);
      return;
    }
    setTimeout(() => {
      this.errorMessage.set('');
      this.clearForm();
    }, 2000);
    if (this.billForm.invalid) {
      this.markFormGroupTouched(this.billForm);
      //this.isProcessing.set(false);
      return;
    }

    try {
      this.processExcelData(
        this.worksheetData,
        this.selectedMid,
        this.selectedText
      );

      const userId = this.appState.getParameter(AppState.UserId);
      await this.readingSource.bulkUpload(this.excelData, userId).toPromise();

      this.successMessage.set('Data imported successfully!');
      setTimeout(() => {
        this.successMessage.set('');
        this.clearForm();
      }, 4000);
    } catch (err) {
      console.error('Upload Error:', err);
      this.errorMessage.set('Failed to import data. Please try again.');
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  uploadExcel(event: Event): void {
    this.errorMessage.set('');
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      this.errorMessage.set('No file selected.');
      return;
    }

    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
    console.log('File name without extension:', fileNameWithoutExtension);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.worksheetData = worksheet;
      // this.processExcelData(worksheet);
    };

    reader.readAsBinaryString(file);
  }

  private processExcelData(
    worksheet: XLSX.WorkSheet,
    selectedMid: any,
    selectedText: string
  ): void {
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawData.length < 2) {
      this.errorMessage.set('Excel file is empty or missing data.');

      return;
    }
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const mismatchedRows = jsonData.filter((row) => {
      const meterId = row['Asset_Meter']?.toString().trim(); // <-- FIXED HERE
      return meterId !== selectedText.trim();
    });

    if (mismatchedRows.length > 0) {
      this.errorMessage.set(
        `Mismatch found. File name "${selectedText}" does not match MeterID .`
      );
      console.error(this.errorMessage);
      this.clearForm();
      return;
    }

    const headers = rawData[0];
    const meterIndex = headers.indexOf('Asset_Meter');
    const readingIndex = headers.indexOf('Current Reading');
    const dateIndex = headers.indexOf('Reading Date and Time');

    if (meterIndex === -1 || readingIndex === -1 || dateIndex === -1) {
      this.errorMessage.set(
        'Excel format incorrect. Missing required columns.'
      );
      return;
    }

    this.excelData = rawData
      .slice(1)
      .reduce((acc: ExcelRow[], row: any[], index) => {
        if (!this.isValidRow(row, meterIndex, readingIndex, dateIndex))
          return acc;

        const formattedDate = this.parseExcelDate(row[dateIndex]);
        const previousDate = index > 0 ? acc[index - 1]?.Date : null;

        acc.push({
          MeterID: selectedMid,
          Reading: parseFloat(row[readingIndex]),
          Date: formattedDate,
          Type: this.determineType(formattedDate, previousDate),
        });

        return acc;
      }, []);

    //.successMessage.set('Excel file processed successfully.');
    const userId = this.appState.getParameter(AppState.UserId);
    this.readingSource.bulkUpload(this.excelData, userId).subscribe({
      next: (res) => {
        //this.successMessage.set('Data imported successfully!');
        console.log('Upload Success:', res);
      },
      error: (err) => {
        console.error('Upload Error:', err);
      },
    });

    //this.successMessage.set('Data imported successfully!');
    //this.readingSource.bulkUpload(this.excelData, 1);
    console.log(this.excelData);
  }

  private isValidRow(
    row: any[],
    meterIndex: number,
    readingIndex: number,
    dateIndex: number
  ): boolean {
    return (
      row &&
      row.length >= 3 &&
      row[meterIndex] !== undefined &&
      row[readingIndex] !== undefined &&
      row[dateIndex] !== undefined
    );
  }

  private isDeviceValidRow(
    row: any[],
    bACnetDeviceID: number,
    bACnetDeviceName: number,
    bACnetObjectName: number,
    BACnetObjectID: number
  ): boolean {
    return (
      row &&
      row.length >= 4 &&
      row[bACnetDeviceID] !== undefined &&
      row[bACnetDeviceName] !== undefined &&
      row[bACnetObjectName] !== undefined &&
      row[BACnetObjectID] !== undefined
    );
  }

  private parseExcelDate(excelDate: any): string {
    if (!excelDate) return '';

    const date =
      typeof excelDate === 'number'
        ? new Date((excelDate - 25569) * 86400 * 1000) // Excel serial date conversion
        : new Date(excelDate);

    return date.toISOString().slice(0, 19).replace('T', ' '); // "YYYY-MM-DD HH:mm:ss"
  }

  private determineType(
    dateStr: string,
    previousDateStr: string | null
  ): string {
    if (!dateStr) return 'D';

    const date = new Date(dateStr);
    const previousDate = previousDateStr ? new Date(previousDateStr) : null;

    if (date.getHours() || date.getMinutes() || date.getSeconds()) return 'H';

    const lastDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const isMonthEnd = date.getDate() === lastDayOfMonth;

    if (!previousDate) return isMonthEnd ? 'M' : 'D';

    const expectedNextDate = new Date(previousDate);
    expectedNextDate.setDate(previousDate.getDate() + 1);

    if (date.getTime() === expectedNextDate.getTime()) return 'D';
    if (isMonthEnd) return 'M';

    return 'D';
  }

  deviceForm = this.fb.group({
    facility: ['', Validators.required],
  });

  deviceExcel(event: Event) {
    this.errorMessage.set('');
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) {
      this.errorMessage.set('No file selected.');
      return;
    }

    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
    console.log('File name without extension:', fileNameWithoutExtension);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.worksheetData = worksheet;
      // this.processExcelData(worksheet);
    };

    reader.readAsBinaryString(file);
  }

  async onDeviceSubmit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    //this.isProcessing.set(true);
    if (!this.worksheetData) {
      this.errorMessage.set('Please upload a file first.');
      //this.isProcessing.set(false);
      return;
    }
    setTimeout(() => {
      this.errorMessage.set('');
      this.clearForm();
    }, 2000);
    if (this.deviceForm.invalid) {
      this.markFormGroupTouched(this.deviceForm);
      //this.isProcessing.set(false);
      return;
    }

    try {
      this.processDeviceExcelData(this.worksheetData, this.selectedText);

      // const userId = this.appState.getParameter(AppState.UserId);
      // await this.readingSource
      //   .BacnetFileUpload(this.excelDeviceRow, userId)
      //   .toPromise();

      // this.successMessage.set('Data imported successfully!');
      // setTimeout(() => {
      //   this.successMessage.set('');
      //   this.clearForm();
      // }, 4000);
    } catch (err) {
      console.error('Upload Error:', err);
      this.errorMessage.set('Failed to import data. Please try again.');
    }
  }

  private processDeviceExcelData(
    worksheet: XLSX.WorkSheet,
    selectedText: string
  ): void {
    const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawData.length < 2) {
      this.errorMessage.set('Excel file is empty or missing data.');

      return;
    }
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    const headers = rawData[0];
    const bACnetDeviceID = headers.indexOf('BACnetDeviceID');
    const bACnetDeviceName = headers.indexOf('BACnetDeviceName');
    const bACnetObjectName = headers.indexOf('BACnetObjectName');
    const bACnetObjectID = headers.indexOf('BACnetObjectID');

    if (
      bACnetDeviceID === -1 ||
      bACnetDeviceName === -1 ||
      bACnetObjectName === -1 ||
      bACnetObjectID === -1
    ) {
      this.errorMessage.set(
        'Excel format incorrect. Missing required columns.'
      );
      return;
    }

    this.excelDeviceRow = rawData
      .slice(1)
      .reduce((acc: ExcelDeviceRow[], row: any[], index) => {
        if (
          !this.isDeviceValidRow(
            row,
            bACnetDeviceID,
            bACnetDeviceName,
            bACnetObjectName,
            bACnetObjectID
          )
        )
          return acc;

        acc.push({
          BACnetDeviceID: row[bACnetDeviceID],
          BACnetDeviceName: row[bACnetDeviceName],
          BACnetObjectID: row[bACnetObjectID],
          BACnetObjectName: row[bACnetObjectName],

          BACnetObjectType: '',
        });

        return acc;
      }, []);

    const userId = this.appState.getParameter(AppState.UserId);
    const FacilityName = this.appState.getParameter(AppState.FacilityName);
    this.readingSource
      .BacnetFileUpload(this.excelDeviceRow, FacilityName)
      .subscribe({
        next: (res) => {
          //this.successMessage.set('Data imported successfully!');
          console.log('Upload Success:', res);
        },
        error: (err) => {
          console.error('Upload Error:', err);
        },
      });
    this.successMessage.set('Data imported successfully!');
    setTimeout(() => {
      this.successMessage.set('');
      this.clearForm();
    }, 4000);
    //this.successMessage.set('Data imported successfully!');
    //this.readingSource.bulkUpload(this.excelData, 1);
    console.log(this.excelData);
  }
}
