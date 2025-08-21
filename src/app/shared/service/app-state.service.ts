import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private localStorageKey = 'myAppData';
  private parameters: any = {};

  constructor() {
    // Retrieve parameters from local storage when service is initialized
    const storedParams = localStorage.getItem(this.localStorageKey);
    if (storedParams) {
      this.parameters = JSON.parse(storedParams);
    }
  }

  addParameter(name: string, value: any) {
    this.parameters[name] = value;
    this.saveParameters();
  }

  getParameter(paramName: string): any {
    return this.parameters[paramName] || null;
  }

  removeParameter(paramName: string): void {
    localStorage.removeItem(paramName); // ✅ Remove from localStorage
    if (this.parameters) {
      delete this.parameters[paramName]; // ✅ Remove from internal object if it exists
    }
  }

  clearParameters() {
    this.parameters = {};
    localStorage.removeItem(this.localStorageKey);
  }

  private saveParameters() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.parameters));
  }
  private actionTypeSubject = new BehaviorSubject<string | null>(null);

  get actionType$() {
    return this.actionTypeSubject.asObservable();
  }

  setActionType(actionType: string) {
    this.actionTypeSubject.next(actionType);
  }
}
