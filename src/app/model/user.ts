import { Driver } from './driver';
export class User {
  public id:number;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public phone: string;
  public password: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public profileImageUrl: string;
  public isActive: boolean;
  public isNotLocked: boolean;
  public role: string;
  public verified:number;
  public point:number;
  public profit:number;
  public authorities: [];
  public driver:Driver;

  constructor() {
    this.id=0;
    this.userId = '';
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.phone = '';
    this.password= '';
    this.lastLoginDate = new Date();
    this.lastLoginDateDisplay = new Date();
    this.joinDate = new Date();
    this.profileImageUrl = '';
    this.isActive = false;
    this.isNotLocked = false;
    this.role = '';
    this.verified = 0;
    this.point=0;
    this.authorities = [];
    this.driver=new Driver();
  }

}
