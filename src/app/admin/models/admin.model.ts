export class AddFacility {
  facilityId!: number | undefined;
  facilityName!: string;
  address1!: string;
  address2?: string;
  countryID!: number;
  stateID!: number;
  city!: string;
  postalCode!: string;
  mobileNumber!: string;
  email!: string;
  timeZone!: string;

  constructor(init?: Partial<AddFacility>) {
    Object.assign(this, init);
  }
}

export class AddBuildings {
  facilityId!: number | undefined;
  facilityName?: string;
  locationName!: string;
  locationId!: number | undefined;
  address1!: string;
  address2?: string;
  countryID!: number;
  stateID!: number;
  city!: string;
  postalCode!: string;
  mobileNumber!: string;
  email!: string;
  parentLocationId?: number;
  constructor(init?: Partial<AddBuildings>) {
    Object.assign(this, init);
  }
}

export class AddFloor {
  facilityId!: number | undefined;
  locationName!: string;
  locationId!: number | undefined;
  bLocationId!: number | undefined;
  parentLocationId?: number;
  assetId?: number;
  assetName!: string;
  assetNumber!: string;
  assetType!: string;
  assetUnit!: string;
  area!: number;
  areaUnit!: string;
  capacity!: string;
  capacityUnit!: string;
  utilityRate!: string;
  targetIntensity?: number;
  slope?: number;
  constant?: string;
  fromDate?: string;
  targetBudget?: number;
  deviceParameter?: number;
  bacnetPointName?: number;
  constructor(init?: Partial<AddFloor>) {
    Object.assign(this, init);
  }
}

export class AddAsset {
  assetId!: number;
  facilityId!: number;
  floorName!: string;
  locationType!: string;
  locationId!: number | undefined;
  locationName!: string;
  parentLocationId?: number;
  parentLocationID?: number | null;
  buildingID!: number;
  buildingName?: string;
  assetName?: string;
  assetNumber!: string;
  assetsType!: string;
  assetTypeId!: number;
  assetsUnit!: string;
  unitId!: number;
  capacity!: number;
  capacityUnit!: string;
  area!: number;
  areaUnit!: string;
  targetIntensity!: number;
  slope!: number;
  constant!: number;
  targetBudget!: number;
  bacnetPointName?: number;
  currentRuntime!: number;
  receivedDate!: Date | string;
  isCriticalAsset!: boolean | number;
  modifiedTimestamp!: Date | string | null;
  modifiedUserName!: string | null;
  fromDate!: Date | string;
  utilityRate!: number;
  constructor(init?: Partial<AddFloor>) {
    Object.assign(this, init);
  }
}
export class AssetColumns {
  static readonly allowedColumns: string[] = [
    'FacilityID',
    'LocationID',
    'ParentLocationID',
    'AssetName',
    'AssetNumber',
    'AssetID',
    'FacilityName',
    'FloorName',
    'LocationType',
    'LocationName',
    'BuildingID',
    'BuildingName',
    'AssetsType',
    'AssetsUnit',
    'Capacity',
    'CapacityUnit',
    'Area',
    'bacnetPointName',
    'AreaUnit',
    'TargetIntensity',
    'Slope',
    'Constant',
    'TargetBudget',
    'DeviceParameter',
    'CurrentRuntime',
    'ReceivedDate',
    'UtilityRate',
    'RateDate',
    'ModifiedUserName',
  ];

  static readonly sortableColumns: string[] = ['AssetName', 'AssetNumber'];

  static readonly hiddenColumns: string[] = [
    'FacilityID',
    'LocationID',
    'ParentLocationID',
    'AssetID',
    'FacilityName',
    'FloorName',
    'LocationType',
    'LocationName',
    'BuildingID',
    'BuildingName',
    'AssetsType',
    'AssetsUnit',
    'Capacity',
    'CapacityUnit',
    'Area',
    'bacnetPointName',
    'AreaUnit',
    'TargetIntensity',
    'Slope',
    'Constant',
    'TargetBudget',
    'DeviceParameter',
    'CurrentRuntime',
    'ReceivedDate',
    'UtilityRate',
    'RateDate',
    'ModifiedUserName',
  ];
}
export class UserColumns {
  static readonly allowedColumns: string[] = [
    'UserID',
    'UserName',
    'Password',
    'EmailAddress',
    'MobileNumber',
    'FacilityID',
    'DisplayLanguage',
    'RoleName',
  ];
  static readonly sortableColumns: string[] = ['UserName', 'EmailAddress'];
  static readonly hiddenColumns: string[] = ['UserID'];
}

export interface ExcelDeviceRow {
  BACnetDeviceID: string;
  BACnetDeviceName: string;
  BACnetObjectName: string;
  BACnetObjectID: string;

  BACnetObjectType: string;
}
