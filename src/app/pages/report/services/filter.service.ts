import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private reloadSubject = new Subject<any>();
  reloadReport = this.reloadSubject.asObservable();

  triggerFilterParams(params: any) {
    this.reloadSubject.next(params);
  }

  private downloadSubject = new Subject<any>();
  downloadReport = this.downloadSubject.asObservable();

  triggerDownload(params: any) {
    this.downloadSubject.next(params);
  }

  private emailSubject = new Subject<any>();
  emailReport = this.emailSubject.asObservable();

  triggerSendEmailReport(params: any) {
    this.emailSubject.next(params);
  }

  private emailEnableSubject = new Subject<boolean>();
  emailNotifier = this.emailEnableSubject.asObservable();

  triggerEmailEnable(params: boolean) {
    this.emailEnableSubject.next(params);
  }
}
