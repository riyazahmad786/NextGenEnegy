import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';
import { HeaderService } from '../../layout/header/services/header.service';
import { AppStateService } from '../../shared/service/app-state.service';
import { ToastService } from '../../shared/service/toast.service';
import { ImageUploadEventService } from '../setting/components/upload-image/service/image-upload-event.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], // Ensure imports are correct
})
export class LoginComponent implements OnInit {
  public icon$ =
    this.imageUploadEvent.getIconSignal() ?? 'assets/images/default.png';
  public bgImage$ =
    this.imageUploadEvent.getBgImageSignal() ??
    'assets/vendors/images/login-page-img4.jpg';

  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  showError: boolean = false;
  errorMessage: string = '';
  forgotPasswordMode: boolean = false;
  forgotPasswordErrorMessage: string = '';
  forgotPasswordSuccessMessage: string = '';

  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private headerService: HeaderService,
    private appState: AppStateService,
    private toastService: ToastService,
    private imageUploadEvent: ImageUploadEventService
  ) {
    headerService.logout();
  }

  ngOnInit() {
    history.pushState(null, '');

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(() => {
        history.pushState(null, '');
        this.showError = true;
      });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false],
    });

    this.forgotPasswordForm = this.fb.group({
      username: ['', [Validators.required]],
    });

    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      this.loginForm.patchValue({
        username: savedUsername,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  signIn(): void {
    if (this.loginForm.valid) {
      const login = {
        Username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };
      this.authService.login(login.Username, login.password).then(
        (response) => {
          let table = response.Table;
          let table1 = response.Table1;
          if (table.length !== 0) {
            this.storageService.saveUser(table);
            this.storageService.savePage(table1);
            this.appState.addParameter('userId', table[0].UserID);
            this.appState.addParameter('UserRole', table[0].UserRole);
            this.headerService.isLogin(true);
            this.authService.setUsername(login.Username);
            this.router.navigate(['/dashboard']);
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('username', login.Username);
              localStorage.setItem('password', login.password);
            } else {
              localStorage.removeItem('password');
            }
          } else {
            this.errorMessage = 'Invalid login attempt.';
          }
        },
        (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Invalid login attempt.';
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }

  toggleForgotPasswordMode(): void {
    this.forgotPasswordMode = !this.forgotPasswordMode;
    this.errorMessage = '';
    this.forgotPasswordErrorMessage = '';
    this.forgotPasswordSuccessMessage = '';
  }

  sendPassword(): void {
    if (this.forgotPasswordForm.valid) {
      const username = this.forgotPasswordForm.value.username;
      this.authService.sendPassword(username).then(
        (response) => {
          if (response.success) {
            this.forgotPasswordSuccessMessage =
              'Password has been sent to your email.';
            this.forgotPasswordErrorMessage = '';
          } else {
            this.forgotPasswordErrorMessage = 'User not found.';
            this.forgotPasswordSuccessMessage = '';
          }
        },
        (error) => {
          this.forgotPasswordErrorMessage =
            'An error occurred. Please try again later.';
          this.forgotPasswordSuccessMessage = '';
        }
      );
    } else {
      this.forgotPasswordErrorMessage = 'Please enter a valid username.';
      this.forgotPasswordSuccessMessage = '';
    }
  }
}
