import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../admin/services/User.service';
import { AppState } from '../../core/utils/report-types-utils';
import { AppStateService } from '../../shared/service/app-state.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  private readonly appState = inject(AppStateService);
  showUserMenu = signal<boolean>(false);
  constructor(
    public navigationService: NavigationService,
    public router: Router,
    private userService: UserService // private readonly userService = inject(UserService);
  ) {}
  ngOnInit() {
    this.checkUserRole();
  }
  checkUserRole() {
    const userRole = this.appState.getParameter('UserRole');
    // Show user menu only if role is NOT 'User' or 'ReportUser'
    this.showUserMenu.set(!['User', 'ReportUser'].includes(userRole));
  }
  isAdmin(): any {
    const userId = this.appState.getParameter(AppState.UserId);
    return this.userService.getUserRole(userId);
  }
  loaduser() {
    const userId = this.appState.getParameter('userId');
    this.userService.getUserRole(userId).subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        this.showUserMenu.set(response?.Table?.length > 0);
      },
      error: (err) => {
        console.error('Error loading facilities:', err);
        this.showUserMenu.set(false);
      },
    });
  }
  getFilteredRoutes() {
    return this.navigationService.routes.filter((route) => {
      // Always show all routes except User route
      if (route.path === '/user') {
        return this.showUserMenu(); // Only show User route if showUserMenu is true
      }
      return true;
    });
  }
  isRouteDisabled(routePath: string): boolean {
    const currentPath = this.router.url;

    // Disable specific routes based on current path
    const disableRules = {
      '/admin': ['/buildings', '/floor', '/asset'],
      '/buildings': ['/floor', '/asset'],
      '/floor': ['/asset'],
      '/reading-source': ['/buildings', '/floor', '/asset'],
      '/user': ['/buildings', '/floor', '/asset'],
      '/setting': ['/buildings', '/floor', '/asset'],
    };

    for (const [path, disabledRoutes] of Object.entries(disableRules)) {
      if (currentPath === path && disabledRoutes.includes(routePath)) {
        return true;
      }
    }

    return false;
  }
}
