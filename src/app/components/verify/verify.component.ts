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
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public show: boolean = false;
  public Form: FormGroup;


  constructor(private fb: FormBuilder,private router: Router, private authenticationService: AuthenticationService,private userService: UserService) {
    if(this.authenticationService.isUserLoggedIn()==true){
      this.router.navigateByUrl('/profil');
    }else{
      this.Form = fb.group({
        email: ['', [Validators.required, Validators.email]],
        verification: ['', Validators.required],
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
    const formData = new FormData();
    formData.append('verified', JSON.stringify(form.verification));
    formData.append('email', form.email);

    this.subscriptions.push(
      this.userService.verify(formData).subscribe(
        (response: CustomHttpRespone) => {
          console.log("response");
          console.log(response);
          Swal.fire({
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:"Compte vérifier",
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
  }
}
