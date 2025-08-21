import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  private breadcrumbs: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumb(this.route.root);
    });
  }
  private updateBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): void {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      this.breadcrumbsSubject.next(breadcrumbs);
      return;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      if (child.snapshot.data.hasOwnProperty('breadcrumb')) {
        const breadcrumbLabel = child.snapshot.data['breadcrumb'];
        breadcrumbs.push({ label: breadcrumbLabel, url: url });
      }

      this.updateBreadcrumb(child, url, [...breadcrumbs]);
    }

  }
  
}
