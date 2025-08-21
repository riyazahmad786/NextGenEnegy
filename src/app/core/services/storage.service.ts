import { Injectable } from '@angular/core';
import { UserResponse } from '../../pages/login/models/user';

const USER_KEY = 'auth-user';
const PAGE_KEY = 'page-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public savePage(page: any): void {
    window.sessionStorage.removeItem(PAGE_KEY);
    window.sessionStorage.setItem(PAGE_KEY, JSON.stringify(page));
  }

  public getPage(): any {
    const page = window.sessionStorage.getItem(PAGE_KEY);
    if (page) {
      return JSON.parse(page);
    }

    return null;
  }

  public getUserId(): number | 0 {
    const userJson = window.sessionStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        const parsedData = JSON.parse(userJson);
        const userId = parsedData["0"].UserID;
        return userId;
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("User data not found in session storage");
    }
    return 0;
  }
  
  public getUserEmailId(): string | '' {
    const userJson = window.sessionStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        const parsedData = JSON.parse(userJson);
        const userId = parsedData["0"].EmailId;
        return userId;
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("User data not found in session storage");
    }
    return '';
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
