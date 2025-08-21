export interface Facility {
  FacilitiesID: number;
  FacilityName: string;
  City: string;
  Latitud: string;
  Longitude: string;
  FTimezone: string;
  BuildingAvailabe: number;
  PostalCode: string;
  CountryName: string;
  //FTimezone: string;
}

export interface LocationModel {
  LocationID: number;
  ParentLocationID?: number; // Using ? to denote optional properties
  LocationName: string;
  LocationType: string;
  Description?: string;
  City: string;
  StateID: number;
  PostalCode: string;
  CountryID: number;
  FacilityID: number;
  Latitud: number;
  Longitude: number;
  FacilityName: string;
  BuildingAvailable: number;
  ModifiedUserName?: string;
  CountryName: string;
  SiteID: number;
}

export interface TimeZoneInfo {
  TimeZone: string;
  UserTimeZoneText: string;
}

export interface RootObject {
  Table: Location[];
  Table1: TimeZoneInfo[];
}
