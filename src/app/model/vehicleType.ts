import { VehicleCategory } from './vehicleCategory';
export class VehicleType {
  public id: number;
  public name: string;
  public tagline: string;
  public tag: string;
  public price:number;
  public picture:string;
  public enabled: boolean;
  public point:number;
  public vehicleCategory:VehicleCategory;
  public vehicleCategorie:VehicleCategory;
  public vehicle_category_id:number;

  constructor() {
    this.id = 0;
    this.name = '';
    this.tagline = '';
    this.tag = '';
    this.price = 0;
    this.picture = '';
    this.enabled = true;
    this.point=0;
    this.vehicleCategory=new VehicleCategory();
    this.vehicleCategorie=new VehicleCategory();
    this.vehicle_category_id=0;
  }

}
