import { VehicleCategory } from 'src/app/model/vehicleCategory';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';



@Injectable({
  providedIn: 'root'
})
export class VehicleCategoryService {

  private record:VehicleCategory;
  private records:any[];
  private subscriptions: Subscription[] = [];


  private host = environment.apiUrl;

  constructor(private http: HttpClient) {
    // console.log("i called vehicleCategoryService");
    // this.subscriptions.push(
    //   this.getRecords().subscribe(
    //     (response: VehicleCategory[]) => {
    //       console.log(response);
    //       this.records = response;
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       console.log(errorResponse);
    //     }
    //   )
    // );
  }

  public getRecords(): Observable<VehicleCategory[] | HttpErrorResponse> {
    return this.http.get<VehicleCategory[]>(`${this.host}/vehicle-category/list`);
  }

  public get(id:number): Observable<VehicleCategory | HttpErrorResponse> {
    return this.http.get<VehicleCategory>(`${this.host}/vehicle-category/get/${id}`);
  }

  public addRecordsToLocalCache(records: VehicleCategory[]): void {
    localStorage.setItem('records', JSON.stringify(records));
  }

  public addRecord(record: VehicleCategory): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle-category/add`, record);
  }

  public updatRecord(formData: FormData): Observable<VehicleCategory | HttpErrorResponse> {
    return this.http.post<VehicleCategory>(`${this.host}/vehicle-category/update`, formData);
  }

  public deleteRecord(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/vehicle-category/delete/${id}`);
  }

  public setRecord(record:VehicleCategory):void{
    this.record=record;
  }

  public getRecord():VehicleCategory{
    return this.record;
  }

  public setList(record:any[]):void{
    this.records=record;
  }

  public getList():any[]{
    return this.records;
  }

  public createRecordFormData(id: number, record: VehicleCategory): FormData {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('name', record.name);
    formData.append('enabled', JSON.stringify(record.enabled));
    return formData;
  }
}
