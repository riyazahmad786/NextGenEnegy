import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FacilityConsumptionExpensesComponent } from './src/app/pages/dashboard/components/facility-consumption-expenses/facility-consumption-expenses.component';
import { HourlyConsumptionComponent } from './src/app/pages/report/electricity/hourly-consumption/hourly-consumption.component';

// ✅ global beforeEach
beforeEach(() => {
  console.log('🚀 Global beforeEach running...');
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(), // normal HttpClient provider
      provideHttpClientTesting(), // mock backend for tests
      HourlyConsumptionComponent,
      FacilityConsumptionExpensesComponent,
    ],
  });
});
