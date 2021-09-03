import { RequestTransaction } from './../model/requestTransaction';
import { Wallet } from './../model/wallet';
import { environment } from './../../environments/environment';
import { CustomHttpRespone } from './../model/custom-http-response';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getRequestTransactions(): Observable<RequestTransaction[] | HttpErrorResponse> {
    return this.http.get<RequestTransaction[]>(`${this.host}/requestTransaction/list`);
  }

  public getUserRequestTransactions(id): Observable<RequestTransaction[] | HttpErrorResponse> {
    return this.http.get<RequestTransaction[]>(`${this.host}/requestTransaction/user/${id}`);
  }

  public getRequestTransaction(id): Observable<RequestTransaction | HttpErrorResponse> {
    return this.http.get<RequestTransaction>(`${this.host}/requestTransaction/get/${id}`);
  }

  public add(requestTransaction: RequestTransaction): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/requestTransaction/add`, requestTransaction);
  }

  public update(requestTransaction: RequestTransaction): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/requestTransaction/update`, requestTransaction);
  }

  public accept(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/requestTransaction/transactionAccept`, formData);
  }

  public refuse(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/requestTransaction/transactionRefuse`, formData);
  }

}
