import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../shared/service/app-state.service';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  @Input() showArea: boolean = true;

  weatherDescription?: string;
  weatherIconUrl?: string;
  mainWeather?: string;
  temperatureFahrenheit?: number;
  humidity?: number;
  countryFlagUrl?: string;
  name?: string;
  siteArea = signal('0');
  celsius?: number;
  locationId?: number;
  facilityId?: number;
  userId?: number;
  isDashboard: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    this.facilityId = this.appState.getParameter('facilityId');
    this.appState.addParameter('dashboardType', 'facility');

    // When setting up the state for a building dashboard
    this.appState.addParameter('dashboardType', 'building');
    this.userId = this.appState.getParameter('userId');
    this.getWeather();
  }

  getWeather(): void {
    this.locationId = this.appState.getParameter('locationId');
    this.weatherService.getWeatherData().subscribe((response) => {
      this.weatherDescription = response.weather[0].description;
      this.weatherIconUrl = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
      this.mainWeather = response.weather[0].main;
      this.temperatureFahrenheit = this.kelvinToFahrenheit(response.main.temp);
      this.humidity = response.main.humidity;
      const countryCodeLower = response.sys.country.toLowerCase();
      this.countryFlagUrl = countryCodeLower;
      this.name = response.name;

      this.celsius = this.convertToCelsius(this.temperatureFahrenheit);
    });
    if (this.locationId && this.facilityId && this.userId) {
      this.weatherService
        .getAreaData(this.locationId, this.facilityId, this.userId)
        .subscribe((response) => {
          if (response?.Table && response.Table.length > 0) {
            this.siteArea.set(response.Table[0].LocationArea); // Assuming FacilityArea is the column name
          }
        });
    }
  }

  private kelvinToFahrenheit(kelvin: number): number {
    return parseFloat((((kelvin - 273.15) * 9) / 5 + 32).toFixed(2));
  }

  convertToCelsius(fahrenheit: number): number {
    return parseFloat((((fahrenheit - 32) * 5) / 9).toFixed(0));
  }
}
