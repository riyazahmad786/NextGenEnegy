import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderService } from '../layout/header/services/header.service';
import { FacilityComponent } from './components/facility/facility.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  //imports: [MenuComponent, FacilityComponent, ListComponent, RouterModule],
  imports: [MenuComponent, FacilityComponent, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.isLogin(true);
  }
}
