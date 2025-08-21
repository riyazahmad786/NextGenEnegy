import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop'; // Convert signal to observable
import { ImageUploadEventService } from '../../../src/app/pages/setting/components/upload-image/service/image-upload-event.service';

@Component({
  selector: 'app-location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.css'],
})
export class LocationReportComponent implements OnInit {
  iconSignal = this.imageUploadEventService.getIconSignal(); // Get the Signal
  iconUrl$ = toObservable(this.iconSignal); // Convert to Observable
  constructor(private imageUploadEventService: ImageUploadEventService) {
    this.imageUploadEventService.updateIcon('someRole');
  }

  ngOnInit(): void {
    //this.imageUploadService.updateIcon('Admin');
    // Trigger image update
  }

  // Call updateIcon method if required
}
