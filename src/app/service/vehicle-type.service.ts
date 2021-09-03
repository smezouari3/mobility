import { City } from './../model/city';
import { VehicleCategoryService } from './vehicle-category.service';
import { VehicleCategory } from 'src/app/model/vehicleCategory';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { VehicleType } from '../model/vehicleType';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {

  private record:VehicleType;
  private records=[];
  private subscriptions: Subscription[] = [];


  private host = environment.apiUrl;

  constructor(private http: HttpClient, private serviceCategory: VehicleCategoryService) {
    // console.log("i called vehicleTypeService");
    // this.subscriptions.push(
    //   this.getRecords().subscribe(
    //     (response: VehicleType[]) => {
    //       this.records = response;
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log(errorResponse);
    //     }
    //   )
    // );
  }

  public getRecords(): Observable<VehicleType[] | HttpErrorResponse> {
    return this.http.get<VehicleType[]>(`${this.host}/vehicle-type/list`);
  }

  public getRecordWithId(id): Observable<VehicleType | HttpErrorResponse> {
    return this.http.get<VehicleType>(`${this.host}/vehicle-type/getWithId/${id}`);
  }

  public getCitiesOfVehicleType(id): Observable<City[] | HttpErrorResponse> {
    return this.http.get<City[]>(`${this.host}/vehicle-type/vehicle-type-city/${id}`);
  }

  public addRecordsToLocalCache(records: VehicleType[]): void {
    localStorage.setItem('records', JSON.stringify(records));
  }

  // public addRecord(record: VehicleType): Observable<CustomHttpRespone | HttpErrorResponse> {
  //   return this.http.post<CustomHttpRespone>(`${this.host}/vehicle-type/add`, record);
  // }

  public addRecord(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle-type/add`, formData);
  }

  public affect(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle-type/affect`, formData);
  }

  public updatRecord(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle-type/update`, formData);
  }

  public deleteRecord(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/vehicle-type/delete/${id}`);
  }

  // public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
  //   return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
  //   {reportProgress: true,
  //     observe: 'events'
  //   });
  // }

  public setRecord(record:VehicleType):void{
    this.record=record;
  }

  public getRecord():VehicleType{
    return this.record;
  }

  public getCategories():Observable<VehicleCategory[] | HttpErrorResponse>{
    return this.serviceCategory.getRecords();
  }

  /* public setList(record:any[]):void{
    console.log(this.records);
    // this.records=[];
    // this.records=record;
    // console.log(this.records);

  } */

  public getList():any[]{
    return this.records;
  }

  public createRecordFormData(id: number, record: VehicleType): FormData {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('name', record.name);
    formData.append('enabled', JSON.stringify(record.enabled));
    return formData;
  }
}
