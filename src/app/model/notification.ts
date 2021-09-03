
import { User } from './user';
export class Notification{
  public id: number;
  public content: string;

  public dateTimeBooking: Date;

  public userNotifiaction:User;
  public userNotif:User;
  public userId :number;


  constructor() {
    this.id = 0;
    this.content = '';
    this.dateTimeBooking=new Date();
  }


}
