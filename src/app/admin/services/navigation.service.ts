// navigation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly routes = [
    { path: '/admin', label: 'Facility' },
    { path: '/buildings', label: 'Building' },
    { path: '/floor', label: 'Floor' },
    { path: '/asset', label: 'Asset' },
    { path: '/reading-source', label: 'Reading Source' },
    { path: '/user', label: 'User' },
    { path: '/setting', label: 'Setting' },
  ];
}
