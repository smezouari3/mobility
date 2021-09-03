import { HeaderType } from './../../enum/header-type.enum';
import { User } from './../../model/user';
import { AuthenticationService } from './../../service/authentication.service';

import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public cust_name:string="salah eddine";

  private subscriptions: Subscription[] = [];
  public loginForm: FormGroup;
  public show: boolean = false;

  constructor(private fb: FormBuilder,private router: Router, private authenticationService: AuthenticationService) {
    if(this.authenticationService.isUserLoggedIn()==true){
      this.router.navigateByUrl('/profil');
    }else{
      this.loginForm = fb.group({
        // email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
  }


  ngOnInit(): void {

  }

  showPassword() {
    this.show = !this.show;
  }

  public onLogin(user: User): void {
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          if((response.body?.verified)==0){
            const token = response.headers.get(HeaderType.JWT_TOKEN);
            this.authenticationService.saveToken(token || '');
            this.authenticationService.addUserToLocalCache(response.body);
            let user:User=response.body;
            if(user.role=='ROLE_USER'){
              this.router.navigateByUrl('/profil');
            }else{
              if(user.role=='ROLE_DRIVER'){
                this.router.navigateByUrl('/driver-profil');
              }else{
                this.router.navigateByUrl('/dashboard/profil');
              }
            }

          }else{
            this.router.navigateByUrl('/verify');
          }

        },
        (errorResponse: HttpErrorResponse) => {
          Swal.fire({
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+errorResponse.error.message+'</b>',
            focusConfirm: false,
          });
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
