import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  GoogleMapsModule,
  MapCircle,
  MapInfoWindow,
  MapMarker,
  MapMarkerClusterer,
} from '@angular/google-maps';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CollapsiblePanelComponent } from '../../../../shared/collapsible-panel/collapsible-panel.component';
import { AppStateService } from '../../../../shared/service/app-state.service';
import { ToastService } from '../../../../shared/service/toast.service';
import { BuildingDashboardService } from '../../../building-dashboard/services/building-dashboard.service';
import { LocationService } from './services/location.service';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [
    GoogleMapsModule,

    MapCircle,
    MapMarker,
    MapInfoWindow,
    MapMarkerClusterer,
    CollapsiblePanelComponent,
  ],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.css',
})
export class GoogleMapComponent implements OnInit, OnDestroy {
  latLngPairsSubscription!: Subscription;
  @ViewChildren(MapInfoWindow) infoWindows!: QueryList<MapInfoWindow>;

  showMap: boolean = true;
  @Input() facilitiesData?: any;
  SiteID: any;
  constructor(
    private locationService: LocationService,
    private BuildingDashboardService: BuildingDashboardService,
    private router: Router,
    private appState: AppStateService,
    private toastService: ToastService
  ) {
    this.userId = this.appState.getParameter('userId');
  }
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';
  // circles: IMapCircle[] = [];
  circles: any[] = [];
  latLngPairs: any[] = [];
  map!: google.maps.Map;
  options: google.maps.MapOptions = {};
  latitude: number = 40.0;
  longitude: number = -80;
  userId?: number;

  ngOnInit(): void {
    this.latLngPairsSubscription = this.locationService
      .getLatLngPairs()
      .subscribe((data: any[]) => {
        this.latLngPairs = data;
        this.reloadMap(); // Call method to reload the map
      });
  }

  ngOnDestroy(): void {
    if (this.latLngPairsSubscription) {
      this.latLngPairsSubscription.unsubscribe();
    }
  }

  reloadMap(): void {
    this.showMap = false;
    if (this.latLngPairs.length > 0) {
      let pair = this.latLngPairs[0];
      this.latitude = parseFloat(pair.Latitud);
      this.longitude = parseFloat(pair.Longitude);
    }

    this.options = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 10,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      maxZoom: 20,
      minZoom: 8,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      // mapTypeId: google.maps.MapTypeId.HYBRID,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    };

    this.circles = this.latLngPairs
      .map((pair, index) => {
        const lat = parseFloat(pair.Latitud);
        const lng = parseFloat(pair.Longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.error(
            `Invalid latitude or longitude at index ${index}:`,
            pair
          );
          return null; // Skip this pair
        }

        const markerOptions = {
          lat: lat,
          lng: lng,
          label: {
            text: pair.Name, // A, B, C, ...
            className: 'circle-label',
            fontSize: '12px',
          },
          icon: {
            url:
              pair.BuildingAvailable == 0
                ? 'http://maps.google.com/mapfiles/ms/icons/red.png'
                : 'http://maps.google.com/mapfiles/ms/icons/blue.png', // Update the URL with the correct path to your custom marker icon
            scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
          },
          FacilityID: pair.FacilityID,
          LocationID: pair.LocationID,
          LocationName: pair.Name,
          BuildingAvailable: pair.BuildingAvailable,
          SiteID: pair.SiteID,
        };

        return {
          id: index + 1,
          lat: lat,
          lng: lng,
          circleOptions: {
            fillColor: '',
            fillOpacity: 0.5,
            strokeWeight: 1,
            strokeColor: '#ff0000',
            clickable: false,
            editable: false,
            zIndex: 1,
            radius: 10, // in meters
          },
          markerOptions: markerOptions,

          markerWindowInfo: {
            html: `<div>${pair.Name}</br>${pair.City} , ${
              pair.CountryName ?? ''
            }</div>`, // Marker A, Marker B, ...
          },
        };
      })
      .filter((item) => item !== null); // Remove null items;
    setTimeout(() => {
      this.showMap = true; // Show map after a short delay to trigger re-rendering
    });
  }

  openMouseoverMarkerInfoWindow(index: number): void {
    this.infoWindows.toArray()[index].open();
  }

  closeMarkerInfoWindow(index: number): void {
    this.infoWindows.toArray()[index].close();
  }

  fitMapToBounds(): void {
    const bounds = new google.maps.LatLngBounds();
    this.circles.forEach((circle) => {
      bounds.extend(circle.getPosition());
    });
    this.map.fitBounds(bounds);
  }

  clickMap(event: google.maps.MapMouseEvent) {
    // const lat = event.latLng?.lat();
    // const lng = event.latLng?.lng();
  }

  openMarkerInfoWindow(
    facilityId: number,
    locationId: number,
    locationName: string,
    SiteID: number
  ) {
    if (SiteID == null) {
      this.BuildingDashboardService.GetsetSettingDetails(
        'Daily',
        this.userId!,
        locationId
      ).subscribe((data: any[]) => {
        const siteData = (data as any).Table;
        if (siteData && siteData.length > 0) {
          const CurrentSiteID = siteData[0];
          if (CurrentSiteID == null) {
            return;
          }
        } else {
          this.toastService.showToast({
            text: 'Date range not added.',
            type: 'warning',
          });
          return;
        }
      });
    }
    if (facilityId != null && locationId != null) {
      this.appState.addParameter('facilityId', facilityId);
      this.appState.addParameter('locationId', locationId);
      this.appState.addParameter('locationName', locationName);
      this.appState.addParameter('actionType', 'Electricity Consumption');
      this.router.navigate(['building']);

      //this.router.navigate(['building'], { queryParams: { FacilityID: facilityId, LocationID: locationId } });
    }
  }
}

interface IMapCircleOptions {
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
  strokeColor: string;
  clickable: boolean;
  editable: boolean;
  zIndex: number;
  radius: number;
}
export interface IMapCircle {
  id: number;
  lat: number;
  lng: number;
  circleOptions: IMapCircleOptions;
  markerOptions: IMapMarker;
  markerWindowInfo: {
    html: string;
  };
}
interface IMapMarker {
  lat: number;
  lng: number;
  label?: {
    text: string;
    className: string;
    fontSize: string;
  };
}
