import { VehicleCategory } from 'src/app/model/vehicleCategory';
import { VehicleType } from 'src/app/model/VehicleType';
import { CustomHttpRespone } from './../../../model/custom-http-response';
import { FileUploadStatus } from './../../../model/file-upload.status';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NotificationsService } from 'angular2-notifications';
import { VehicleTypeService } from 'src/app/service/vehicle-type.service';
import { VehicleCategoryService } from 'src/app/service/vehicle-category.service';


@Component({
  selector: 'app-vehicle-type-add',
  templateUrl: './vehicle-type-add.component.html',
  styleUrls: ['./vehicle-type-add.component.scss']
})
export class VehicleTypeAddComponent implements OnInit {

  public record=new VehicleType();
  public vehicleCategories:any[]=[];

  private subscriptions: Subscription[] = [];

  public validate = false;
  public tooltipValidation = false;
  public selectedRole:String='';
  public fileStatus = new FileUploadStatus();
  public profileImage: File;

  // public profileImage: File;


  title = 'ngImageCrop';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  uploadedFiles: any[] = [];
  cat: any[] = [];



  constructor(private authenticationService:AuthenticationService, private service:VehicleTypeService, private serviceVehicleCategory:VehicleCategoryService, private router:Router, private notificationService:NotificationsService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.serviceVehicleCategory.getRecords().subscribe(
        (response: VehicleCategory[]) => {
          for(let i = 0; i < response.length; i++) {
            let obj = {key:response[i].id,value:response[i].name};
            this.cat.push(obj);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          console.log("error");
          console.log(errorResponse);
        }
      )
    );
  }

  load(event){
    this.vehicleCategories=this.cat;

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

  public submit(): void {

    const formData = new FormData();
    formData.append('name', this.record.name);
    formData.append('tagline', this.record.tagline);
    formData.append('tag', this.record.tag);
    formData.append('price', this.record.price.toString());
    formData.append('vehicleCategoryId', this.record.vehicle_category_id.toString());
    formData.append('enabled', JSON.stringify(this.record.enabled));
    if(this.croppedImage){
      const fileToUpload: File = new File([this.dataURItoBlob(this.croppedImage)], this.record.name+'.png');
      formData.append('picture', fileToUpload);
    }
    this.subscriptions.push(
      this.service.addRecord(formData).subscribe(
        (response:CustomHttpRespone)=>{
          console.log("success");
          console.log(response);
          this.notifier_success('Succes','Ajouter avec succ??s');
          setTimeout(() => {
            this.router.navigateByUrl('/vehicle-type');
          }, 2500);
        },
        (error: HttpErrorResponse)=>{
          console.log("error");
          console.log(error);
          this.notifier_error('Error',error.error.message);
        }
      )
    );
            // this.subscriptions.push(
            //   this.userService.updateProfileImage(formData).subscribe(
            //     (event: HttpEvent<any>) => {
            //       console.log("success");
            //       console.log(event);
            //       Swal.fire({
            //         position: 'top-end',
            //         width: 300,
            //         title: '<strong translate="">Succes</strong>',
            //         icon: 'success',
            //         html:"Photo modifier",
            //         showConfirmButton: false,
            //         timer: 2000
            //       });
            //     },
            //     (errorResponse: HttpErrorResponse) => {
            //       console.log("error");
            //       console.log(errorResponse);
            //       Swal.fire({
            //         position: 'top-end',
            //         width: 300,
            //         title: '<strong translate="">Erreur</strong>',
            //         icon: 'error',
            //         html:
            //           '<b>'+errorResponse.error.message+'</b>',
            //         showConfirmButton: false,
            //         timer: 2000
            //       });
            //       this.fileStatus.status = 'done';
            //     }
            //   )
            // );
          /* }else{
            this.notificationService.error('error','this is not an image',{
              position:['top','right'],
              timeOut:2000,
              animate:'fade',
              showProgressBar:true,
              clickToClose: false,
              clickIconToClose: true
            });
          } */


  }

  notifier_success(title:string,message:string){
    this.notificationService.success(title,message,{
      position:['top','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
  }

  notifier_error(title:string,message:string){
    this.notificationService.error(title,message,{
      position:['top','right'],
      timeOut:2000,
      animate:'fade',
      showProgressBar:true,
      clickToClose: false,
      clickIconToClose: true
    });
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
