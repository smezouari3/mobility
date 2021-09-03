import { Driver } from './driver';
import { VehicleType } from './vehicleType';
import { User } from './user';
export class Vehicle{
  public id: number;
  public brandName: string;
  public vehicleName: string;
  public vehicleColor: string;
  public matricule: string;
  public enabled: boolean;
  public driverVehicle:Driver;
  public vehicleDriver:Driver;
  public driverId:number;

  public vehicleType:VehicleType;
  public vehicType:VehicleType;
  public vehicle_type_id:number;

  constructor() {
    this.id = 0;
    this.brandName = '';
    this.vehicleName = '';
    this.vehicleColor = '';
    this.matricule = '';
    this.enabled = true;
    this.driverVehicle=new Driver();
    this.vehicleDriver=new Driver();
    this.driverId=0;
    this.vehicleType=new VehicleType();
    this.vehicType=new VehicleType();
    this.vehicle_type_id=0;
  }


}
