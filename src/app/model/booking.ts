import { City } from './city';
import { VehicleType } from './vehicleType';
import { Vehicle } from './vehicle';
import { User } from './user';
import { Driver } from './driver';
export class Booking{
  public id: number;
  public fromLatitude: string;
  public fromLongitude: string;
  public toLatitude: string;
  public toLongitude: string;
  public distance: number;
  public price: number;
  public paymentType: string;
  public status: string;
  public note: string;
  public dateTimeBooking: Date;

  public customer:User;
  public customerBooking:User;
  public customerId:number;

  public driver:Driver;
  public vehicleDriver:Driver;
  public driver_id:number;

  public vehicleTypeBooking:VehicleType;
  public vehicleType:VehicleType;
  public vehicle_type_id:number;

  public vehicle:Vehicle;
  public vehicleBooking:Vehicle;
  public vehicle_id:number;

  public cityBooking:City;
  public city_id:number;

  constructor() {
    this.id = 0;
    this.fromLatitude = '';
    this.fromLongitude = '';
    this.toLatitude = '';
    this.toLongitude = '';
    this.distance = 0;
    this.price = 0;
    this.paymentType = '';
    this.status = '';
    this.note = '';
    this.dateTimeBooking=new Date();
    this.city_id=null;

    this.customer=new User();
    this.customerBooking=new User();
    this.customerId=0;

    this.driver=new Driver();
    this.vehicleDriver=new Driver();
    this.driver_id=0;

    this.vehicleTypeBooking=new VehicleType();
    this.vehicleType=new VehicleType();
    this.vehicle_type_id=0;

    this.vehicle=new Vehicle();
    this.vehicleBooking=new Vehicle();
    this.vehicle_id=0;

  }


}
