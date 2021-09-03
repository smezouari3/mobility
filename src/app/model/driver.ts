import { Booking } from './booking';
import { Vehicle } from 'src/app/model/Vehicle';
import { User } from './user';
import { City } from './city';
export class Driver {
  public id: number;
  // public profit: number;
  public available: boolean;
  public city_id: number;
  public city: City;

  public userId:number;
  public userInfo:User;

  public vehicle:Vehicle;

  // public bookings:Booking[];


  constructor() {
    this.id = 0;
    // this.profit=0;
    this.city_id=0
    // this.city=new City();
    this.userId=0;
    // this.userInfo=new User();
  }

}
