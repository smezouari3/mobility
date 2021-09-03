import { Booking } from './../model/booking';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class BookingService {


  private record:Booking;
  private records:any[];

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getBookings(): Observable<Booking[] | HttpErrorResponse> {
    return this.http.get<Booking[]>(`${this.host}/booking/list`);
  }

  public getPaindingBooking(): Observable<Booking[] | HttpErrorResponse> {
    return this.http.get<Booking[]>(`${this.host}/booking/lists`);
  }

  public getBookingWithCustomer(id): Observable<Booking[] | HttpErrorResponse> {
    return this.http.get<Booking[]>(`${this.host}/booking/getwithcustomer/${id}`);
  }

  public getBooking(id): Observable<Booking | HttpErrorResponse> {
    return this.http.get<Booking>(`${this.host}/booking/get/${id}`);
  }

  public addRecord(record: Booking): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/add`, record);
  }

  public updateBooking(record: Booking): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/update`, record);
  }

  public cancelBooking(record: Booking): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/cancel`, record);
  }

  public bookingStart(record: Booking,position:any): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/booking-start/${position}`, record);
  }

  public setDriver(record: Booking): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/set-driver`, record);
  }

  public notifyCustomer(record: Booking): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/notify-customer`, record);
  }

  public complete(record: Booking,done:any): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/booking/complete/${done}`, record);
  }

  public notif(): Observable<String | HttpErrorResponse> {
    return this.http.get<String>(`${this.host}/booking/notif`);
  }

}
