import { User } from './../../model/user';
import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading: boolean=false;
  private subscriptions: Subscription[] = [];
  public Form: FormGroup;

  public show: boolean = false;




  constructor(private fb: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {
    if(this.authenticationService.isUserLoggedIn()==true){
      this.router.navigateByUrl('/profil');
    }else{
      this.Form = fb.group({
        firstName:['',Validators.required],
        lastName:['',Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        phone: ['', [ Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(12)]],
        password: ['', [ Validators.required, Validators.minLength(8)]]
        // phone: ['', Validators.required],
        // password: ['', Validators.required]
      });
    }
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/dashboard/profil');
    }
  }

  public onRegister(user: User): void {
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          console.log("this is success");
          console.log(response);
          Swal.fire({
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:
              "<b>Votre compte a été créé s'il vous plaît vérifier votre courrier pour vérifier votre adresse e-mail.</b>",
            focusConfirm: false,
          })
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("this is error");
          console.log(errorResponse);
          Swal.fire({
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+errorResponse.error+'</b>',
            focusConfirm: false,
          })
        }
      )
    );
  }

  // public onRegister(user: User): void {
  //   this.subscriptions.push(
  //     this.authenticationService.register(user).subscribe(
  //       (response: any) => {
  //         Swal.fire({
  //           position: 'top-end',
  //           title: response,
  //           showConfirmButton: false,
  //           timer: 3000
  //         })
  //       },
  //       (errorResponse: HttpErrorResponse) => {
  //         Swal.fire({
  //           position: 'top-end',
  //           title: errorResponse.error.text,
  //           showConfirmButton: false,
  //           timer: 3000
  //         })
  //       }
  //     )
  //   );
  // }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showPassword() {
    this.show = !this.show;
  }

}
