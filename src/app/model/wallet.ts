
import { User } from './user';
export class Wallet{
  public id: number;
  public amount: number;
  public transactionDescription: string;
  public dateTimeTransaction: Date;

  public user:User;
  public userWallet:User;
  public userId:number;

  constructor() {
    this.id = 0;
    this.amount = 0;
    this.transactionDescription = '';
    this.dateTimeTransaction=new Date();
    this.userId=0;
  }


}
