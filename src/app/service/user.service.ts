import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpRespone } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user:User;
  private host = environment.apiUrl;
  private records=[];

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public getUsersByRole(role): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.host}/user/list-by-role/${role}`);
  }

  public userGet(id): Observable<User | HttpErrorResponse> {
    return this.http.get<User>(`${this.host}/user/get/${id}`);
  }

  /* public addUser(user: User): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/add`, user);
  } */

  public addUser(user: User, city:number): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/add/${city}`, user);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }
  public updateUserV2(formData: FormData): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/updatev2`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/resetpassword/${email}`);
  }

  public resetUserPassword(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/resetuserpassword`,formData);
  }

  public verify(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/verify`, formData);
  }

  public resend_verification(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/resendverify`, formData);
  }

  public getResetCode(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/get-reset-code`, formData);
  }

  public passwordReset(formData: FormData): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.post<CustomHttpRespone>(`${this.host}/user/reset-password`, formData);
  }


  public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
    {reportProgress: true,
      observe: 'events'
    });
  }

/*   public deleteUser(username: string): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${username}`);
  } */

  /* public deleteUser(username: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/user/delete/${username}`);
  } */

  public deleteUser(username: string): Observable<CustomHttpRespone | HttpErrorResponse> {
    return this.http.get<CustomHttpRespone>(`${this.host}/user/bb/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public setUser(user:User):void{
    this.user=user;
  }

  public getUser():User{
    return this.user;
  }

  public getList():any[]{
    return this.records;
  }
  // public getUsersFromLocalCache(): User[] {
  //   if (localStorage.getItem('users')) {
  //       return JSON.parse(localStorage.getItem('users'));
  //   }
  //   return null;
  // }

  public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('phone', user.phone);
    formData.append('role', user.role);
    formData.append('verified', JSON.stringify(user.verified));
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNotLocked));
    return formData;
  }

}
