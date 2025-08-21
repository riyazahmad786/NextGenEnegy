import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  signal,
} from '@angular/core';

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { StorageService } from '../../../../core/services/storage.service';
import { IzFilerButtonComponent } from '../../../../shared/iz-filer-button/iz-filer-button.component';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ToastService } from '../../../../shared/service/toast.service';
import { FilterService } from '../../../report/services/filter.service';
import { ActionService } from '../../services/action.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    IzFilerButtonComponent,
    FormsModule,
    //RouterOutlet,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  @Input() isDisabled: boolean = false;
  @Input() isRecord: boolean = true;
  action = signal('');
  curetUrl = signal('');
  reportType = signal('');
  actionType: string = '';
  isEmailAndDownloadButtonEnable = signal<boolean>(true);
  buttonConfigs = [
    { label: 'Hourly', iconClass: 'fa fa-clock-o' },
    { label: 'Daily', iconClass: 'dw dw-calendar1' },
    { label: 'Monthly', iconClass: 'fa fa-calendar' },
    { label: 'Yearly', iconClass: 'fa fa-calendar-o' },
  ];
  emailId: any = '';
  constructor(
    private actionService: ActionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fs: FilterService,
    private appState: AppStateService,
    private fb: FormBuilder,
    private storageService: StorageService,
    private toastService: ToastService
  ) {
    this.emailId = this.storageService.getUserEmailId();
    this.subscribeToButtonEnable();
  }

  ngOnInit(): void {
    const url = this.router.url;
    this.curetUrl.set(url);
    this.initializeAction();
    this.setSelectedIndex();
    this.subscribeToReload();
  }

  private initializeAction(): void {
    const actionType = this.getParameter('actionType');
    this.triggerReloadParams(actionType);
    this.reloadPage(actionType);
  }

  private subscribeToReload(): void {
    this.actionService.reload$.subscribe((params) => this.reloadPage(params));
  }

  private subscribeToButtonEnable(): void {
    this.fs.emailNotifier.subscribe((params: boolean) => {
      this.isEmailAndDownloadButtonEnable.set(params);
    });
  }

  private reloadPage(params: string): void {
    const reportType = this.getParameter('reportType');
    this.setReportType(reportType);
    this.setAction(params);
    this.detectChanges();
  }

  private getParameter(param: string): string {
    return this.appState.getParameter(param);
  }

  private triggerReloadParams(actionType: string): void {
    this.actionService.triggerReloadParams(actionType);
  }

  private setReportType(reportType: string): void {
    this.reportType.set(reportType);
  }

  private setAction(params: string): void {
    this.action.set(params);
  }

  private detectChanges(): void {
    this.cdr.detectChanges();
  }

  reportShow(type: any): void {
    this.appState.addParameter('reportType', type);
    this.appState.addParameter('chartType', 'column');
    this.appState.addParameter('FloorName', '');
    this.navigateToReport();
    this.setSelectedIndex();
  }

  private navigateToReport(): void {
    if (this.router.url !== '/report') {
      this.router.navigate(['report']);
    }
  }

  private setSelectedIndex(): void {
    const reportType = this.getParameter('reportType');
    this.setReportType(reportType);
    const actionType = this.getParameter('actionType');
    this.setAction(actionType);
    this.triggerFilterParams(reportType);
  }

  private triggerFilterParams(reportType: string): void {
    this.fs.triggerFilterParams(reportType);
  }
  downloadReport(): void {
    const reportType = this.getParameter('reportType');
    this.fs.triggerDownload(reportType);
  }

  sendEmailReport(): void {
    const reportType = this.getParameter('reportType');
    const email = this.emailId;
    const perms = { reportType, email };
    this.fs.triggerSendEmailReport(perms);
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
      return;
    }
  }

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  display = 'none';
  openModal() {
    const emailId = this.storageService.getUserEmailId();
    this.form.patchValue({
      email: emailId, // Set the value for the 'email' control
      // Add other form controls here if needed
    });
    this.display = 'block';
  }

  closeModal() {
    this.display = 'none';
  }
}
