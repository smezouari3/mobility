import { Booking } from './booking';
import { Driver } from './driver';
export class Rating {
  public id: number;
  public rating: number;
  public review:string;
  public driverId: number;
  public bookingId: number;
  public driverRat: Driver;


  constructor() {
    this.id = 0;
    this.rating=0;
    this.review="";
    this.driverId=0;
    this.bookingId=0;
  }

}
