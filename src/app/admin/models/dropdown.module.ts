export interface ICountry {
  countryID: number;
  countryName: string;
}

export interface IState {
  stateID: number;
  stateName: string;
  fk_CountryID: number;
}

export interface ITimeZones {
  Id: string;
  DisplayName: string;
  StandardName: string;
  SupportsDaylightSavingTime: string;
}

export interface IAssetType {
  assetTypeId: number;
  assetType: string;
}

export interface IAssetUnit {
  assetTypeId: number;
  UnitId: number;
  Unit: string;
}
