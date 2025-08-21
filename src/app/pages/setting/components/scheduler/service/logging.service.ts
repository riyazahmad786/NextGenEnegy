import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logKey = 'scheduleLogs';

  // Log data to local storage
  logData(data: any): void {
    const existingLogs = this.getLogs();
    existingLogs.push(data);
    localStorage.setItem(this.logKey, JSON.stringify(existingLogs));
  }

  // Retrieve logs from local storage
  getLogs(): any[] {
    const logs = localStorage.getItem(this.logKey);
    return logs ? JSON.parse(logs) : [];
  }
}