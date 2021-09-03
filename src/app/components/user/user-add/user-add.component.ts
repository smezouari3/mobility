
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';
import { UserService } from 'src/app/service/user.service';
import { USE_STORE } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  public validate = false;
  user: User =new User();
  private currentUsername: string;
  // private email: string;
  public profileImage: File;
  private subscriptions: Subscription[] = [];


  public roles=[
    {key:"ROLE_SUPER_ADMIN",value:"SUPER ADMIN"},
    {key:"ROLE_ADMIN",value:"ADMIN"},
    {key:"ROLE_MANAGER",value:"MANAGER"},
    {key:"ROLE_USER",value:"USER"},
    {key:"ROLE_DRIVER",value:"DRIVER"},
    {key:"ROLE_HR",value:"HR"},
  ];


  constructor(private authenticationService:AuthenticationService, private userService:UserService, private router:Router, private notificationService:NotificationsService) { }

  ngOnInit(): void {
    this.currentUsername=this.user.username;
  }

  lod(){
    console.log("lod");
    this.notificationService.error('Failed','Failed to load imagsse',{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  public submit() {
    this.validate = !this.validate;
    // const formData = this.userService.createUserFormDate(this.currentUsername, this.user, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(this.user,0).subscribe(
        (response: CustomHttpRespone) => {
          console.log("success");
          console.log(response);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:"ajouter avec succès",
            showConfirmButton: false,
            timer: 2000
          });
          // this.user=null;
          // this.clickButton('closeEditUserModalButton');
          // this.getUsers(false);
          // this.fileName = null;
          // this.profileImage = null;
          // this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} updated successfully`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("error");
          console.log(errorResponse);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+errorResponse.error.message+'</b>',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
      );
  }

}
