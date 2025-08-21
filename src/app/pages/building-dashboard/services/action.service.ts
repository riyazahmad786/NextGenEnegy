import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private reloadSubject = new Subject<any>();

  reload$ = this.reloadSubject.asObservable();

  triggerReloadParams(params: any) {
    this.reloadSubject.next(params);
  }

}
