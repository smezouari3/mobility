import { Wallet } from './../model/wallet';
import { environment } from './../../environments/environment';
import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getWallets(): Observable<Wallet[] | HttpErrorResponse> {
    return this.http.get<Wallet[]>(`${this.host}/wallet/list`);
  }

  public getUserWallets(id): Observable<Wallet[] | HttpErrorResponse> {
    return this.http.get<Wallet[]>(`${this.host}/wallet/user/${id}`);
  }

  public getWallet(id): Observable<Wallet | HttpErrorResponse> {
    return this.http.get<Wallet>(`${this.host}/wallet/get/${id}`);
  }

  public transaction(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/wallet/transaction`, formData);
  }

  public versement(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/wallet/versement`, formData);
  }


}
