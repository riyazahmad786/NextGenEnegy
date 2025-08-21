import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from '../app/admin/admin.component';
import { BuildingComponent } from './admin/components/building/building.component';
import { BuildingDashboardComponent } from './pages/building-dashboard/building-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ReportComponent } from './pages/report/report/report.component';
import { SettingComponent } from './pages/setting/setting.component';
//import { SchedulerComponent } from './pages/setting/components/scheduler/scheduler.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetComponent } from './admin/components/asset/asset.component';
import { FloorComponent } from './admin/components/floor/floor.component';
import { ReadingSourceComponent } from './admin/components/reading-source/reading-source.component';
import { UserComponent } from './admin/components/user/user.component';
export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'building',
    component: BuildingDashboardComponent,
    data: { breadcrumb: 'Building' },
  },
  {
    path: 'report',
    component: ReportComponent,
    data: { breadcrumb: 'Report' },
  },
  {
    path: 'setting',
    component: SettingComponent,
    data: { breadcrumb: 'Setting' },
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: { breadcrumb: 'Admin' },
  },
  {
    path: 'buildings',
    component: BuildingComponent,
    data: { breadcrumb: 'Building' },
  },
  {
    path: 'buildings/:param1/:param2',
    component: BuildingComponent,
  },
  {
    path: 'floor',
    component: FloorComponent,
    data: { breadcrumb: 'Floor' },
  },
  {
    path: 'asset',
    component: AssetComponent,
    data: { breadcrumb: 'Asset' },
  },
  {
    path: 'reading-source',
    component: ReadingSourceComponent,
    data: { breadcrumb: 'ReadingSource' },
  },

  {
    path: 'user',
    component: UserComponent,
    data: { breadcrumb: 'User' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule],
})
export class AppModule {}
