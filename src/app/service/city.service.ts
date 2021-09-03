import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { City } from './../model/city';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityService {


  private record:City;
  private records:any[];

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getRecords(): Observable<City[] | HttpErrorResponse> {
    return this.http.get<City[]>(`${this.host}/city/list`);
  }

  public getRecordsForMap(): Observable<City[] | HttpErrorResponse> {
    return this.http.get<City[]>(`${this.host}/city/list-cities`);
  }

  public addRecord(record: City): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/city/add`, record);
  }

  public updatRecord(record: City): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/city/update`, record);
  }

  public deleteRecord(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/city/delete/${id}`);
  }

}
