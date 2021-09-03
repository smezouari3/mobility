import { VehicleType } from 'src/app/model/VehicleType';
export class VehicleCategory {
  public id: number;
  public name: string;
  public enabled: boolean;
  public vehicleType:VehicleType[];

  constructor() {
    this.id = 0;
    this.name = '';
    this.enabled = true;
    this.vehicleType=[];
  }

}
