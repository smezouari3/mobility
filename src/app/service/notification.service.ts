import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Notification } from './../model/notification';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notification:Notification;
  private host = environment.apiUrl;
  private records=[];
  notification$: BehaviorSubject<Notification> = new BehaviorSubject<Notification>(null);


  constructor(private http: HttpClient) {}

  public getNotifications(): Observable<Notification[] | HttpErrorResponse> {
    return this.http.get<Notification[]>(`${this.host}/notification/list`);
  }

  public deleteNotification(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/notification/delete/${id}`);
  }

  public deleteUserNotification(id: number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/notification/delete-notif/${id}`);
  }



  // setNotification(notification: Notification) {
  //   this.notification$.next(notification);
  // }

  // getNotification() {
  //   return this.notification$.asObservable();
  // }
}
