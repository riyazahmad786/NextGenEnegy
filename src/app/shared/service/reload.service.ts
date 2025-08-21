import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  private reloadSubject = new Subject<void>();

  // Observable string streams
  reloadObservable$ = this.reloadSubject.asObservable();

  // Service message commands
  requestReload() {
    this.reloadSubject.next();
  }
}
