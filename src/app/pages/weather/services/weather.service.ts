import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
const baseUrl = environment.baseUrl + 'Location/';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '8c6c5521fbd1eab1140a75fdab3dd8a1';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private weatherData = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // getWeather(city: string,cCode:string): Observable<any> {
  //   const url = `${this.apiUrl}?zip=${city},${cCode}&appid=${this.apiKey}`;
  //   return this.http.get(url);
  // }

  getWeather(
    Latitud: string,
    Longitude: string,
    name: string,
    areaSize: number
  ): void {
    const url = `${this.apiUrl}?lat=${Latitud}&lon=${Longitude}&appid=${this.apiKey}`;

    this.http.get(url).subscribe(
      (data: any) => {
        data.name = name;
        data.siteArea = areaSize;

        this.weatherData.next(data); // update the BehaviorSubject
      },
      (error) => {
        console.error('Error fetching weather:', error);
      }
    );
  }

  getWeatherData(): Observable<any> {
    return this.weatherData.asObservable();
  }
  getAreaData(
    locationId: number,
    facilityId: number,
    userId: number
  ): Observable<any> {
    const url = `${baseUrl}GetTotalArea?LocationID=${locationId}&FacilityID=${facilityId}&UserID=${userId}`;
    return this.http.get(url);
  }
}
