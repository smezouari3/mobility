import { AuthenticationService } from 'src/app/service/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomHttpRespone } from './../../model/custom-http-response';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {


  private subscriptions: Subscription[] = [];
  public show: boolean = false;
  public Form: FormGroup;


  constructor(private fb: FormBuilder,private router: Router, private authenticationService: AuthenticationService, private userService: UserService) {
    if(this.authenticationService.isUserLoggedIn()==true){
      this.router.navigateByUrl('/profil');
    }else{
      this.Form = fb.group({
        email: ['', [Validators.required, Validators.email]],
        reset: ['', Validators.required],
        password: ['', [ Validators.required, Validators.minLength(8)]],
        rpassword: ['', [ Validators.required, Validators.minLength(8)]]
      });
    }
  }

  ngOnInit() {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/dashboard/profil');
    }
  }

  onSubmit(form){
    console.log(form)
    if(form.password==form.rpassword){
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('reset', JSON.stringify(form.reset));

      this.subscriptions.push(
        this.userService.passwordReset(formData).subscribe(
          (response: CustomHttpRespone) => {
            console.log("response");
            console.log(response);
            Swal.fire({
              title: '<strong translate="">Succes</strong>',
              icon: 'success',
              html:"Mot de passe modifier",
              focusConfirm: false,
            });
            setTimeout(function () {}, 3000);
            this.router.navigateByUrl('/login');
          },
          (error: HttpErrorResponse) => {
            console.log("error");
            console.log(error);
            Swal.fire({
              title: '<strong translate="">Erreur</strong>',
              icon: 'error',
              html:
                '<b>'+error.error.message+'</b>',
              focusConfirm: false,
            });
          }
        )
      );

    }else{
      Swal.fire({
        title: '<strong translate="">Erreur</strong>',
        icon: 'error',
        html:
          '<b>Mot de passe non identique</b>',
        focusConfirm: false,
      });
    }
  }
  showPassword() {
    this.show = !this.show;
  }

}
