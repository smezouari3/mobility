import { VehicleType } from './vehicleType';
export class City {
  public id: number;
  public name: string;
  public tag: string;
  public enabled: boolean;
  public vehicleTypes:VehicleType[];

  constructor() {
    this.id = 0;
    this.name = '';
    this.tag = '';
    this.enabled = true;
    this.vehicleTypes=[];
  }

}
