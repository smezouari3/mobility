import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Settings } from './../model/settings';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private record:Settings;
  private records:any[];

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getRecords(): Observable<Settings[] | HttpErrorResponse> {
    return this.http.get<Settings[]>(`${this.host}/setting/list`);
  }

  public getRecordByKey(key:String): Observable<Settings| HttpErrorResponse> {
    return this.http.get<Settings>(`${this.host}/setting/get/${key}`);
  }
}
