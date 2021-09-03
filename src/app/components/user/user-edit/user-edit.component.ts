import { CustomHttpRespone } from './../../../model/custom-http-response';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';
import { UserService } from 'src/app/service/user.service';
import { USE_STORE } from '@ngx-translate/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @Input() user: User;
  private subscriptions: Subscription[] = [];

  public validate = false;
  public tooltipValidation = false;
  public selectedRole:String='';
  public fileStatus = new FileUploadStatus();
  private currentUsername: string;
  private email: string;
  public profileImage: File;

  // public profileImage: File;


  title = 'ngImageCrop';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  uploadedFiles: any[] = [];


  public roles=[
    {key:"ROLE_SUPER_ADMIN",value:"SUPER ADMIN"},
    {key:"ROLE_ADMIN",value:"ADMIN"},
    {key:"ROLE_MANAGER",value:"MANAGER"},
    {key:"ROLE_USER",value:"USER"},
    {key:"ROLE_HR",value:"HR"},
  ];


  constructor(private authenticationService:AuthenticationService, private userService:UserService, private router:Router, private notificationService:NotificationsService) { }

  ngOnInit(): void {
    if(this.userService.getUser()){
      this.user=this.userService.getUser();
      this.currentUsername=this.user.username;
      this.email=this.user.email;
      console.log(this.user);
    }
    else{
      this.user=new User();
      this.router.navigateByUrl("/users");
    }
  }

  public submit() {
    this.validate = !this.validate;
    const formData = this.userService.createUserFormDate(this.currentUsername, this.user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          console.log("success");
          console.log(response);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:"Modifier avec succès",
            showConfirmButton: false,
            timer: 2000
          });
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
    console.log(formData);
  }
  public tooltipSubmit() {
    this.tooltipValidation = !this.tooltipValidation;
  }

  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }


  fileChangeEvent(event: any): void {
    // this.profileImage=event.target.files[0];
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(this.croppedImage);
  }
  imageLoaded() {
      /* show cropper */
  }
  cropperReady() {
      /* cropper ready */
  }
  loadImageFailed() {
    this.notificationService.error('Failed','Failed to load image',{
      position:['bottom','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  public onUpdateProfileImage(): void {
    if(this.croppedImage){
      const fileToUpload: File = new File([this.dataURItoBlob(this.croppedImage)], this.user.username+'.png');
      const formData = new FormData();
      formData.append('username', this.user.username);
      formData.append('profileImage', fileToUpload);
      this.subscriptions.push(
        this.userService.updateProfileImage(formData).subscribe(
          (event: HttpEvent<any>) => {
            console.log("success");
            console.log(event);
            Swal.fire({
              position: 'top-end',
              width: 300,
              title: '<strong translate="">Succes</strong>',
              icon: 'success',
              html:"Photo modifier",
              showConfirmButton: false,
              timer: 2000
            });
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
            this.fileStatus.status = 'done';
          }
        )
      );
    }else{
      this.notificationService.error('error','this is not an image',{
        position:['top','right'],
        timeOut:2000,
        animate:'fade',
        showProgressBar:true,
        clickToClose: false,
        clickIconToClose: true

      });
    }
  }

  public onRsetPassword(){
    this.subscriptions.push(
      this.userService.resetPassword(this.email).subscribe(
        (response: CustomHttpRespone) => {
          console.log(response);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Succes</strong>',
            icon: 'success',
            html:response.message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          Swal.fire({
            position: 'top-end',
            width: 300,
            title: '<strong translate="">Erreur</strong>',
            icon: 'error',
            html:
              '<b>'+error.error.message+'</b>',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
    );
  }

  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

}
