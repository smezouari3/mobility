import { Vehicle } from './../model/vehicle';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private record:Vehicle;
  private records:any[];

  private host = "http://localhost:8081";

  constructor(private http: HttpClient) {}

  public getRecords(): Observable<Vehicle[] | HttpErrorResponse> {
    return this.http.get<Vehicle[]>(`${this.host}/vehicle/list`);
  }

  public get(id:number): Observable<Vehicle | HttpErrorResponse> {
    return this.http.get<Vehicle>(`${this.host}/vehicle/get/${id}`);
  }

  public getMatricule(matricule:String): Observable<Vehicle | HttpErrorResponse> {
    return this.http.get<Vehicle>(`${this.host}/vehicle/get-matricule/${matricule}`);
  }

  public addRecordsToLocalCache(records: Vehicle[]): void {
    localStorage.setItem('records', JSON.stringify(records));
  }

  public addRecord(record: Vehicle): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle/add`, record);
  }

  public updatRecord(record: Vehicle): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/vehicle/update`, record);
  }

  /* public updatRecord(formData: FormData): Observable<Vehicle | HttpErrorResponse> {
    return this.http.post<Vehicle>(`${this.host}/vehicle/update`, formData);
  } */

  public deleteRecord(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/vehicle/delete/${id}`);
  }

  public setRecord(record:Vehicle):void{
    this.record=record;
  }

  public getRecord():Vehicle{
    return this.record;
  }

  public setList(record:any[]):void{
    this.records=record;
  }

  public getList():any[]{
    return this.records;
  }

  /* public createRecordFormData(id: number, record: Vehicle): FormData {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('name', record.name);
    formData.append('enabled', JSON.stringify(record.enabled));
    return formData;
  } */
}
