import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment-image';
import { StorageService } from '../../core/services/storage.service';
import { FileService } from '../../pages/setting/components/upload-image/service/file.service';
import { ImageUploadEventService } from '../../pages/setting/components/upload-image/service/image-upload-event.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { AppStateService } from '../../shared/service/app-state.service';
import { TooltipDirective } from '../../shared/tooltip/tooltip.directive';
import { FirstLetterPipe } from './Pipes/first-letter.pipe';
import { HeaderService } from './services/header.service';
const baseUrl = environment.baseUrl;
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [
    RouterModule,
    TooltipDirective,
    FirstLetterPipe,
    CapitalizePipe,
    ToastComponent,
  ],
})
export class HeaderComponent implements OnInit {
  public icon$ = this.imageUploadEvent.getIconSignal();
  email: string = 'admin@gmail.com';
  userName: string = 'Admin';
  isLoggedIn: boolean = true;
  userRole: string = '';
  // icon$ = signal('assets/images/logo3.png');
  //endDate = signal('');

  constructor(
    private appState: AppStateService,
    private headerService: HeaderService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private storage: StorageService,
    private imageUploadEvent: ImageUploadEventService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {
    // effect(() => {
    //   const currentIcon = this.imageUploadEvent.getIconSignal()();
    //   //this.updateImage(currentIcon);
    // });
    this.imageUploadEvent.updateIcon('User');
  }

  ngOnInit(): void {
    this.headerService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      const userInfo = this.storage.getUser();
      if (userInfo) {
        this.email = userInfo[0]['EmailId'];
        this.userName = userInfo[0]['UserName'];
        this.userRole = this.appState.getParameter('UserRole') || '';
      }
    });
  }
  shouldShowAdminLink(): boolean {
    return ['Super Admin', 'Admin', 'User'].includes(this.userRole);
  }
  // updateImage(currentIcon: any) {
  //   this.icon$.set(currentIcon);
  // }

  // getUploadImage() {
  //   this.fileService.getFileDetails('Admin').subscribe({
  //     next: (result: any) => {
  //       if (result) {
  //         this.icon$.set(
  //           baseUrl +
  //             'Files/' +
  //             result.Table[0].LogoUrl +
  //             '?' +
  //             new Date().getTime()
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error retrieving file details:', err);
  //     },
  //   });
  // }
}
