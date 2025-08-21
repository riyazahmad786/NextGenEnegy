/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationReportComponent } from './location-report.component';

describe('LocationReportComponent', () => {
  let component: LocationReportComponent;
  let fixture: ComponentFixture<LocationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LocationReportComponent], // 👈 standalone को imports में
    }).compileComponents();

    fixture = TestBed.createComponent(LocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
