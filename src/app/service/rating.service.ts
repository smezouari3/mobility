import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Rating } from './../model/rating';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private record:Rating;
  private records:any[];

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getDrivers(): Observable<Rating[] | HttpErrorResponse> {
    return this.http.get<Rating[]>(`${this.host}/rating/list`);
  }

  public getDriver(id): Observable<Rating[] | HttpErrorResponse> {
    return this.http.get<Rating[]>(`${this.host}/rating/get-driver/${id}`);
  }

  public getBooking(id): Observable<Rating | HttpErrorResponse> {
    return this.http.get<Rating>(`${this.host}/rating/get-booking/${id}`);
  }

  public addRecord(record: Rating): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/rating/add`, record);
  }
}
