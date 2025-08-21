import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { AppStateService } from '../../../shared/service/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();
  constructor(
    private storage: StorageService,
    private appState: AppStateService
  ) {}

  isLogin(statusLogin: boolean) {
    this.isLoggedIn.next(statusLogin);
  }

  logout() {
    this.storage.clean();
    this.appState.clearParameters();
    this.isLoggedIn.next(false);
  }
}
