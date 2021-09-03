
import { User } from './user';
export class RequestTransaction{
  public id: number;
  public amount: number;
  public transactionType: string;
  public statutTransaction: string;
  public dateTimeTransaction: Date;

  public user:User;
  public userTransaction:User;
  public userId:number;

  constructor() {
    this.id = 0;
    this.amount = 0;
    this.transactionType = '';
    this.statutTransaction = '';
    this.dateTimeTransaction=new Date();
    this.userId=0;
  }


}
